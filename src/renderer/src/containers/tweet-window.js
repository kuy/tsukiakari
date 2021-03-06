import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TweetWindow from '../components/tweet-window';
import * as tweets from '../actions/tweets';
import * as sidemenu from '../actions/sidemenu';

function mapStateToProps(state) {
  return {
    isOpen: state.sidemenu.isTweetWindowOpen,
    accounts: state.accounts.accounts,
    replyTweet: state.sidemenu.replyTweet,
    replyAccount: state.sidemenu.replyAccount,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    post: bindActionCreators(tweets.postTweet, dispatch),
    close: bindActionCreators(sidemenu.closeTweetWindow, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TweetWindow);
