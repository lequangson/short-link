import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button } from 'antd'
import isEmpty from 'lodash/isEmpty'
const { TextArea } = Input

@inject('facebook')
@observer
export default class postArticle extends Component {
  state = { listId: [] }

  // componentDidMount() {
  //   const url =
  //     '/me?fields=id,name,birthday&access_token=EAAElFGs7desBAMLRWQ9cX5qu1AmvCcYoYiuo3UAFw9ZBF7Y3ZCVlHbD6tMexBSZBolikCjcL4W3tRZC82yClFmqzsVx8NzFe9Wyc9oqWOrH0PSdkOZCVH1jPpwKZC0vZAKWAY0mBbnDlSquarGIqpl7Iy398XpvkOXhIHDzI7Uz1a8TRZCYKB98A7EAkYnna2iMZD'
  //   this.props.facebook.getUser(url)
  // }

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
      const access_token = value.match(/tokenk=(.*?)&/)[1]
      const url = value.match(/url=(.*?)&/)[1]
      const image = value.match(/image=(.*?)&/)[1]
      const mess = value.match(/mess=(.*?)&/)[1]
      const mess2 = value.match(/mess2=(.*?)$/)[1]
      const pageid = value.match(/pageid=(.*?)&/)[1]
      const sub = value.match(exSub)
      if (!isEmpty(sub)) {
        finalList.push({
          dataPost: {
            access_token,
            url: image,
            published: false,
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

  render() {
    const { main, list, listId } = this.state
    return (
      <div>
        <p>this page only for post article on facebook</p>
        <TextArea
          placeholder="Autosize height with minimum and maximum number of lines"
          autosize={{ minRows: 2, maxRows: 6 }}
          onChange={this.handleChange()}
        />
        <Button type="primary" disabled={!main} onClick={this.postMuntiple}>
          post
        </Button>
        {!isEmpty(listId) && (
          <table className="table">
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
            }
          </table>
        )}
      </div>
    )
  }
}
