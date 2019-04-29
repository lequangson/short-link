import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Row, Col, Input, Layout, Button } from 'antd'
const { TextArea } = Input
const ButtonGroup = Button.Group



@inject('userStore', 'shortLinks')
@withRouter
@observer
export default class shortLink extends Component {
  state = { isSingle: true, single: '', mutiple: '' }

  toggleMethodShort = () => this.setState(pre => ({ isSingle: !pre.isSingle }))

  handleChange = typeData => evt => this.setState({ [typeData]: evt.target.value})

  render() {
    const { shortLink } = this.props.shortLinks
    const { isSingle } = this.state
    return (
      <Layout className='px-4'>
        <Row>
          <Col className='gutter-row' span={17} align='middle'>
          <Row>
          <Col className='gutter-row' span={17} align='middle'>
            {isSingle ? (
              <Input
                placeholder='Paste a long url'
                onChange={this.handleChange('single')}
              />
            ) : (
              <TextArea
                placeholder='Autosize height with minimum and maximum number of lines'
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={this.handleChange('mutiple')}
              />
            )}
            </Col>
            <Button
                type="primary"
                onClick={shortLink}>
                Short
            </Button>
            </Row>
            <ButtonGroup className='d-flex justify-content-end mt-4'>
              <Button
                type={isSingle ? 'primary' : ''}
                onClick={this.toggleMethodShort}>
                Single
              </Button>
              <Button
                type={!isSingle ? 'primary' : ''}
                onClick={this.toggleMethodShort}>
                Mutiple
              </Button>
            </ButtonGroup>
          </Col>
          <Col className='gutter-row' span={7} />
        </Row>
      </Layout>
    )
  }
}
