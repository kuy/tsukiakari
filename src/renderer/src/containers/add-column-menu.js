import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddColumnMenu from '../components/add-column-menu';
import * as sidemenu from '../actions/sidemenu';
import * as column from '../actions/column';

function mapStateToProps(state) {
  return {
    accounts: state.accounts.accounts,
    isOpen: state.sidemenu.isAddColumnMenuOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    close: bindActionCreators(sidemenu.closeAddColumnMenu, dispatch),
    onCreate: bindActionCreators(column.addColumn, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddColumnMenu);
