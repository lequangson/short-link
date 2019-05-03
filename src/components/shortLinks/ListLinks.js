import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Input, Select } from 'antd'
import { isEmpty, isEqual } from 'lodash'
import ListShow from './ListShow'
import { toJS } from 'mobx'

const { Search } = Input
const Option = Select.Option

const selectOptions = [
  { key: 'newest', label: 'newest' },
  { key: 'oldest', label: 'oldest' },
  { key: 'popular', label: 'popular' },
]
@inject(stores => ({
  allLinks: stores.shortLinks.allLinks,
}))
@observer
class ListLinks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valueSelect: selectOptions[0],
      valueSearch: '',
      newest: [],
      oldest: [],
      popular: [],
      currentList: [],
    }
  }

  componentDidMount() {
    const allLinks = this.props.allLinks
    if (!isEmpty(toJS(allLinks))) {
      this.handleDataForLists(allLinks)
    }
  }

  componentWillReceiveProps(nextProps) {
    const allLinks = this.props.allLinks
    if (!isEqual(toJS(nextProps.allLinks), toJS(allLinks))) {
      this.handleDataForLists(nextProps.allLinks)
    }
  }

  handleDataForLists = allLinks => {
    const data = {}
    data.newest = allLinks.slice().sort(function compare(a, b) {
      var dateA = new Date(a.date)
      var dateB = new Date(b.date)
      return dateA - dateB
    })
    data.oldest = data.newest.slice().reverse()
    data.popular = allLinks.slice().sort(function(a, b) {
      return b.num_click - a.num_click
    })
    this.setState({ ...data, currentList: data[this.state.valueSelect.key] })
  }

  handleChange = value => {
    this.setState({
      valueSelect: value,
      currentList: this.state[value.key],
    })
  }

  handleSearch = value => {
    const currentList = this.props.allLinks.filter(
      item => `${item.main_url}${item.sub_url}`.includes(value),
    )
    this.setState({
      valueSearch: value,
      currentList,
    })
  }

  render() {
    const { valueSelect, currentList } = this.state
    return (
      <div className='bg-white py-4 px-2'>
        <Row className='d-flex justify-content-start align-items-center mb-5'>
          <Col span={17}>
            <Search
              placeholder='input search text'
              enterButton='Search'
              size='large'
              onSearch={this.handleSearch}
            />
          </Col>
          <Col className='d-flex justify-content-end' span={7}>
            <Select
              labelInValue
              defaultValue={valueSelect}
              style={{ width: 80 }}
              onChange={this.handleChange}>
              {selectOptions.map(item => (
                <Option key={item.key} value={item.key}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
         <hr />       
        <ListShow data={currentList} />
      </div>
    )
  }
}

export default ListLinks
