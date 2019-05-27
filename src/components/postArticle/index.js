import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Checkbox } from 'antd'
import isEmpty from 'lodash/isEmpty'
import { copyToClipboard, selectElementContents } from 'utilities'
const { TextArea } = Input

@inject('facebook')
@observer
export default class postArticle extends Component {
  state = { listId: [], isPublish: false }

  // componentDidMount() {
  //   const url =
  //     '/me?fields=id,name,birthday&access_token=EAAElFGs7desBAMLRWQ9cX5qu1AmvCcYoYiuo3UAFw9ZBF7Y3ZCVlHbD6tMexBSZBolikCjcL4W3tRZC82yClFmqzsVx8NzFe9Wyc9oqWOrH0PSdkOZCVH1jPpwKZC0vZAKWAY0mBbnDlSquarGIqpl7Iy398XpvkOXhIHDzI7Uz1a8TRZCYKB98A7EAkYnna2iMZD'
  //   this.props.facebook.getUser(url)
  // }

  onCheckPublish = e =>
    this.setState({
      isPublish: e.target.checked,
    })

  setUrl = data => this.setState({ list: data })

  setMain = data => this.setState({ main: data })

  handleChange = () => evt => {
    const listLink = evt.target.value.trim().split('\n')
    const exSub = /(http(s)?:\/\/)|(\/.*){1}/g
    const mainUrl = listLink[0].replace(exSub, '')
    if (mainUrl) {
      this.setState({
        main: `http://${mainUrl}`,
      })
    }
    const listSub = listLink.reduce((finalList, value) => {
      const sub = value.match(exSub)
      if (!isEmpty(sub)) {
        const access_token = value.match(/tokenk=(.*?)&/)[1]
        const url = value.match(/url=(.*?)&/)[1]
        const image = value.match(/image=(.*?)&/)[1]
        const mess = value.match(/mess=(.*?)&/)[1]
        const mess2 = value.match(/mess2=(.*?)$/)[1]
        const pageid = value.match(/pageid=(.*?)&/)[1]
        finalList.push({
          dataPost: {
            access_token,
            url: image,
            published: this.state.isPublish,
            caption: `${mess}\norder here: ${url}\n${mess2}`,
          },
          pageid,
        })
      }
      return finalList
    }, [])
    this.setUrl(listSub)
  }

  postMuntiple = () => {
    const { postArticle } = this.props.facebook
    const { list } = this.state
    Promise.all(
      list.map(item => postArticle(`/${item.pageid}/photos`, item.dataPost)),
    )
      .then(data => this.setState({ listId: data }))
      .catch(() => alert('hãy thử lại nhé'))
  }

  handleCopy = () => {
    const { list, listId } = this.state
    selectElementContents( document.getElementById('tableId') )
    const listUrls = list.reduce((finalList, item, index) => {
      finalList.push(`${item.dataPost.url}\t${listId[index].id}`)
      return finalList
    }, [])
    copyToClipboard(listUrls.join('\n'))
  }

  render() {
    const { main, list, listId, isPublish } = this.state
    return (
      <div className="p-3">
        <p>this page only for post article on facebook</p>
        <TextArea
          placeholder="Autosize height with minimum and maximum number of lines"
          autosize={{ minRows: 2, maxRows: 6 }}
          onChange={this.handleChange()}
          className="mb-3"
        />
        <div className="d-flex justify-content-between mb-3">
          <Button type="primary" disabled={!main} onClick={this.postMuntiple}>
            post
          </Button>
          {!isEmpty(listId) && (
            <Button
              type="danger"
              disabled={isEmpty(listId)}
              onClick={this.handleCopy}
            >
              copy all
            </Button>
          )}
          <Checkbox onChange={this.onCheckPublish} checked={isPublish}>
            published
          </Checkbox>
        </div>
        {!isEmpty(listId) && (
          <table className="table" ref={ref => this.tableRef = ref} id="tableId">
            <thead>
              <tr>
                <th scope="col">img</th>
                <th scope="col">id</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}>
                  <th scope="row">
                    <a target="_blank" href={item.dataPost.url}>
                      {item.dataPost.url}
                    </a>
                  </th>
                  <td>{listId[index].id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }
}
