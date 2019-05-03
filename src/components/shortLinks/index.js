import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Input, Layout, Button } from 'antd'
import { isEmpty } from 'lodash'
import { toJS } from 'mobx'
import ListLinks from './ListLinks'

const { TextArea } = Input
const ButtonGroup = Button.Group

@inject('userStore', 'shortLinks')
@observer
export default class shortLink extends Component {
  state = { isSingle: true }

  toggleMethodShort = () => this.setState(pre => ({ isSingle: !pre.isSingle }))

  handleChange = typeData => evt => {
    const listLink = evt.target.value
      .trim()
      .replace(/\n/g, ' ')
      .split(' ')
    const { setMain, setUrl } = this.props.shortLinks
    const exSub = /(http(s)?:\/\/)|(\/.*){1}/g
    const subUrl = listLink[0].match(exSub)
    const mainUrl = listLink[0].replace(exSub, '')
    if (mainUrl) {
      setMain(`http://${mainUrl}`)
    }
    if (typeData === 'single' && !isEmpty(subUrl)) {
      setUrl([subUrl[1] || subUrl[0]])
    } else {
      const listSub = listLink.reduce((finalList, value) => {
        const sub = value.match(exSub)
        if (!isEmpty(sub)) {
          finalList.push(sub[1] || sub[0])
        }
        return finalList
      }, [])
      setUrl(listSub)
    }
  }

  copyToClipboard = str => () => {
    const el = document.createElement('textarea') // Create a <textarea> element
    el.value = str // Set its value to the string that you want copied
    el.setAttribute('readonly', '') // Make it readonly to be tamper-proof
    el.style.position = 'absolute'
    el.style.left = '-9999px' // Move outside the screen to make it invisible
    document.body.appendChild(el) // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0 // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0) // Store selection if found
        : false // Mark as false to know no selection existed before
    el.select() // Select the <textarea> content
    document.execCommand('copy') // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el) // Remove the <textarea> element
    if (selected) {
      // If a selection existed before copying
      document.getSelection().removeAllRanges() // Unselect everything on the HTML document
      document.getSelection().addRange(selected) // Restore the original selection
    }
  }

  render() {
    const { shortLink, mainUrl, listShort, info } = this.props.shortLinks
    const { isSingle } = this.state
    return (
      <Layout className='p-4'>
        <Row className='pb-4' gutter={16}>
          <Col className='gutter-row' span={17} align='middle'>
            <Row className='bg-white py-4 px-2'>
              {listShort.map(item => {
                return (
                  <Row key={item} className="my-3">
                    <Col className='gutter-row' span={17} align='middle'>
                      <a className='text-success' target='_blank' href={item}>
                        {item}
                      </a>
                    </Col>
                    <Button
                      type='ghost'
                      className='text-success'
                      onClick={this.copyToClipboard(item)}>
                      Copy
                    </Button>
                  </Row>
                )
              })}
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
              <Col className='d-flex justify-content-end' span={7}>
                <Button type='primary' disabled={!mainUrl} onClick={shortLink}>
                  Short
                </Button>
              </Col>
            </Row>

            <ButtonGroup className='d-flex justify-content-end my-4'>
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

            <ListLinks />
          </Col>
          <Col className='gutter-row' span={7}>
            <Row  className='bg-white p-4'>
              <h4 className="mb-4">Info</h4>
              <p>tổng links: {info.urls}</p>
              <p>tổng click: {info.clicks}</p>
            </Row>
          </Col>
        </Row>
      </Layout>
    )
  }
}
