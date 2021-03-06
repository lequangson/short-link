import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Input, Layout, Button } from 'antd';
import { isEmpty } from 'lodash';
import { copyToClipboard } from 'utilities';
import ListLinks from './ListLinks';

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

  render() {
    const { shortLink, mainUrl, listShort, info } = this.props.shortLinks
    const { isSingle } = this.state
    const regLink = /^\S*/
    return (
      <Layout className="p-4">
        <Row className="pb-4" gutter={16}>
          <Col className="gutter-row" span={17} align="middle">
            <Row className="bg-white py-4 px-2">
              {listShort.map(item => {
                return (
                  <Row key={item.match(regLink)} className="my-3">
                    <Col className="gutter-row" span={17} align="middle">
                      <a
                        className="text-success"
                        target="_blank"
                        href={item.match(regLink)}
                      >
                        {item.match(regLink)}
                      </a>
                    </Col>
                    <Button
                      type="ghost"
                      className="text-success"
                      onClick={copyToClipboard(item)}
                    >
                      Copy
                    </Button>
                  </Row>
                )
              })}
              {!isEmpty(listShort) && <Col
                className="gutter-row mb-4 d-flex justify-content-end"
                span={24}
                align="middle"
              >
                <Button
                  type="ghost"
                  className="text-success"
                  onClick={copyToClipboard(listShort.join('\n'))}
                >
                  Copy All
                </Button>
              </Col>}
              <Col className="gutter-row" span={17} align="middle">
                {isSingle ? (
                  <Input
                    placeholder="Paste a long url"
                    onChange={this.handleChange('single')}
                  />
                ) : (
                  <TextArea
                    placeholder="Autosize height with minimum and maximum number of lines"
                    autosize={{ minRows: 2, maxRows: 6 }}
                    onChange={this.handleChange('mutiple')}
                  />
                )}
              </Col>
              <Col className="d-flex justify-content-end" span={7}>
                <Button type="primary" disabled={!mainUrl} onClick={shortLink}>
                  Short
                </Button>
              </Col>
            </Row>

            <ButtonGroup className="d-flex justify-content-end my-4">
              <Button
                type={isSingle ? 'primary' : ''}
                onClick={this.toggleMethodShort}
              >
                Single
              </Button>
              <Button
                type={!isSingle ? 'primary' : ''}
                onClick={this.toggleMethodShort}
              >
                Mutiple
              </Button>
            </ButtonGroup>

            <ListLinks />
          </Col>
          <Col className="gutter-row" span={7}>
            <Row className="bg-white p-4">
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
