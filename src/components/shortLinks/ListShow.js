import React, { Component } from 'react'
import { Row, Col, List, Avatar, Button, Skeleton, Modal, Checkbox } from 'antd'
import { isEqual } from 'lodash'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { ROOT_URL } from 'constant'

const count = 5
@inject('shortLinks')
@observer
class ListShow extends Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    curentIndex: 0,
    listSelect: [],
    visible: false,
  }

  componentDidMount() {
    const { data } = this.props
    const newData = data ? this.handleData(data) : []
    this.setState({
      initLoading: false,
      data: newData,
      list: newData[this.state.curentIndex],
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(toJS(this.props.data), toJS(nextProps.data))) {
      const newData = this.handleData(nextProps.data)
      this.setState({
        data: newData,
        list: newData[this.state.curentIndex],
      })
    }
  }

  toggleItem = id => e => {
    const { listSelect } = this.state
    let newList = listSelect.slice()
    if (e.target.checked) {
      newList.push(id)
    } else {
      newList.splice(listSelect.indexOf(id), 1)
    }
    console.log('newList', newList)
    this.setState({
      listSelect: newList,
    })
  }

  showModal = id => () => {
    this.setState({
      visible: true,
      deleteId: id,
    })
  }

  handleOk = () => {
    this.props.shortLinks.deleteLinks([this.state.deleteId])
    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleData = data => {
    const a = data.slice()
    const arrays = []
    while (a.length > 0) arrays.push(a.splice(0, count))

    return arrays
  }

  onLoadMore = () => {
    this.setState(
      ({ list, curentIndex, data }) => ({
        list: list.concat(data[curentIndex + 1]),
        curentIndex: curentIndex + 1,
      }),
      () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'))
      },
    )
    // this.getData((res) => {
    //   const data = this.state.data.concat(res.results);
    //   this.setState({
    //     data,
    //     list: data,
    //     loading: false,
    //   }, () => {
    //     window.dispatchEvent(new Event('resize'));
    //   });
    // });
  }

  render() {
    const { initLoading, loading, list, curentIndex, data } = this.state
    const { deleteLinks } = this.props.shortLinks
    const loadMore =
      curentIndex + 1 < data.length && !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}>
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null

    return (
      <Row>
        <Col span={24}>
          <List
            className='demo-loadmore-list'
            loading={initLoading}
            itemLayout='horizontal'
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                actions={[
                  <a>edit</a>,
                  <span
                    className='text-danger'
                    onClick={this.showModal(item.code)}>
                    delete
                  </span>,
                ]}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      // <Avatar src='http://sunsports.store/wp-content/uploads/2019/04/imgpsh_fullsize_anim-1.png' />
                      <Checkbox onChange={this.toggleItem(item.code)} />
                    }
                    title={
                      <a href={`${ROOT_URL}${item.code}`} target='_blank'>
                        {`${ROOT_URL}${item.code}`}
                      </a>
                    }
                    description={
                      <a
                        href={`${item.main_url}${item.sub_url}`}
                        className='text-truncate d-inline-block w-50'
                        style={{ maxWidth: 400 + 'px' }}
                        target='_blank'>
                        {`${item.main_url}${item.sub_url}`}
                      </a>
                    }
                  />
                  <div className='text-success'>{item.num_click} click</div>
                </Skeleton>
              </List.Item>
            )}
          />
        </Col>
        <Modal
          title='confirm modal'
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <p>Bạn chắc chắn muốn xoá nó chứ?</p>
        </Modal>
      </Row>
    )
  }
}

export default ListShow
