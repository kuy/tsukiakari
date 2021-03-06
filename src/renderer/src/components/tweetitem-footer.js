import React, { Component, PropTypes } from 'react';
import { fromNow } from '../lib/formatTime';
import B from '../lib/bem';

const b = B.with('tweetitem-footer');

export default class TweetItemFooter extends Component {
  static propTypes = {
    tweet: PropTypes.object,
    createFavorite: PropTypes.func,
    destroyFavorite: PropTypes.func,
    createRetweet: PropTypes.func,
    destroyRetweet: PropTypes.func,
    reply: PropTypes.func,
    accounts: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.onReply = ::this.onReply;
    this.onRetweet = ::this.onRetweet;
    this.onFavorite = ::this.onFavorite;
  }

  onReply() {
    const { tweet } = this.props;
    this.props.reply({ account: this.props.accounts[0], tweet });
  }

  onRetweet() {
    const { tweet } = this.props;
    if (tweet.retweeted) {
      this.props.destroyRetweet({ account: this.props.accounts[0], tweet });
    } else {
      this.props.createRetweet(this.props.accounts[0], tweet);
    }
  }

  onFavorite() {
    const { tweet } = this.props;
    if (tweet.favorited) {
      this.props.destroyFavorite(this.props.accounts[0], tweet);
    } else {
      this.props.createFavorite(this.props.accounts[0], tweet);
    }
  }

  render() {
    const { tweet } = this.props;
    return (
      <div className={b()}>
        <span className={b('icon-wrapper')}>
          <i
            className={`${b('icon', { reply: true })} fa fa-reply`}
            onClick={this.onReply}
          />
        </span>
        <span className={b('icon-wrapper')}>
          <i
            className={`${b('icon', { retweet: !tweet.retweeted || 'active' })} fa fa-retweet`}
            onClick={this.onRetweet}
          />
          {tweet.retweet_count || ''}
        </span>
        <span className={b('icon-wrapper')}>
          <i
            className={`${b('icon', { favorite: !tweet.favorited || 'active' })} fa fa-heart`}
            onClick={this.onFavorite}
          />
          {tweet.favorite_count || ''}
        </span>
        <span className={b('time')}>
          {fromNow(tweet.created_at)}
        </span>
      </div>
    );
  }
}
