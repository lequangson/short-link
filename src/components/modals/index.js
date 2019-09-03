import React from 'react';
import { inject, observer } from 'mobx-react';

@inject(stores => ({
  currentModal: stores.commonStore.currentModal,
}))
@observer

export default class RootModalComponent extends React.Component {
  render() {
    const {modalType: ModalComponent, modalProps} = this.props.currentModal
    if (!ModalComponent) return null;
    return <ModalComponent {...modalProps} />;
  }
};

