/* eslint-disable no-constant-condition */

import T from '../lib/twitter-client';
import { eventChannel } from 'redux-saga';
import { fork, take, call, put, cancel } from 'redux-saga/effects';
import * as actions from '../actions/tweets';
import { normalize, Schema } from 'normalizr';
import { ipcRenderer } from 'electron';

const tweetSchema = new Schema('tweets', { idAttribute: 'id_str' });

const subscribe = (stream, account) => (
  eventChannel(emit => {
    stream.on('data', data => {
      if (data.friends) {

      } else if (data.event) {

      } else if (data.delete) {

      } else if (data.created_at) {
        //if (data.retweeted_status && data.retweeted_status.user.id_str === user.id_str) {
        // eventEmitter.emit('retweet', data);
        //}
        emit(actions.recieveTweet({ tweet: normalize(data, tweetSchema), account, type: 'Home' }));
      }
    });
    
    stream.on('error', (error) => {
      console.error('Error occurred on stream', error);
      stream.removeAllListeners('data');
      stream.removeAllListeners('error');
      // stream.removeAllListeners('end');
      stream.destroy();
      emit(actions.connectStream({ account, error }));
    });

    ipcRenderer.once('suspend', () => {
      console.log('suspend');
      stream.removeAllListeners('data');
      stream.removeAllListeners('error');
      stream.removeAllListeners('end');
      stream.destroy();
      console.log('stream destroied');
    });

    ipcRenderer.once('resume', () => {
      console.log('resume!!');
      const id = setInterval(() => {
        if (!navigator.onLine) return;
        clearInterval(id);
        emit(actions.connectStream({ account }));
      }, 1000);
    });
  })
);

function connectUserStream({ accessToken, accessTokenSecret }) {
  const t = new T(accessToken, accessTokenSecret);
  return new Promise(resolve => {
    t.client.stream('user', stream => {
      resolve(stream);
    });
  });
}

function* connectStream(account) {
  let channel;
  try {
    const stream = yield connectUserStream(account);
    channel = yield call(subscribe, stream, account);
  } catch (error) {
    console.log(error);
  }
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* watchConnect() {
  const connection = {};
  while (true) {
    // FIXME: 
    const { payload: { account } } = yield take('CONNECT_STREAM');
    if (connection[account.id]) yield cancel(connection[account.id]);
    connection[account.id] = yield fork(connectStream, account);
  }
}

function* destroyRetweet(account, tweet) {
  const { accessToken, accessTokenSecret } = account;
  const twitter = new T(accessToken, accessTokenSecret);
  try {
    const status = yield call(::twitter.getStatus, tweet.id_str);
    yield call(::twitter.destroyTweet, { id: status.current_user_retweet.id_str });
    yield put(actions.successDestroyRetweet({ account, tweet }));
  } catch (error) {
    yield put(actions.failureDestroyRetweet({ account, tweet }));
  }
}

function* watchDestroyRetweet() {
  while (true) {
    const { payload: { account, tweet } } = yield take('REQUEST_DESTROY_RETWEET');
    yield fork(destroyRetweet, account, tweet);
  }
}

export default function* tweetsSaga() {
  yield [
    fork(watchDestroyRetweet),
    fork(watchConnect),
  ];
}

