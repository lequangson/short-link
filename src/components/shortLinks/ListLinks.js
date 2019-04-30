import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Input, Button, Select } from 'antd'
import { isEmpty } from 'lodash'
import ListShow from './ListShow'

const { TextArea, Search } = Input
const ButtonGroup = Button.Group
const Option = Select.Option;


@inject('userStore', 'shortLinks')
@observer
class ListLinks extends Component {
	state = { 
		valueSelect: {key: 'newest', label: 'newest'},
		valueSearch: ''
	}

	handleChange = value => {
	  this.setState({
	    valueSelect: value,
	  });
	}

	handleSearch = value => {
	  this.setState({
	    valueSearch: value,
	  });
	}

  render() {
  	const { valueSelect } = this.state
    return (
      <div className="bg-white py-4 px-2">
		      <Row className="d-flex justify-content-start align-items-center">
		     	 <Col span={17}>
			      	<Search
					      placeholder="input search text"
					      enterButton="Search"
					      size="large"
					      onSearch={this.handleSearch}
					    />
				    </Col>
				    <Col className="d-flex justify-content-end" span={7}>
					    <Select labelInValue defaultValue={valueSelect} style={{ width: 80 }} onChange={this.handleChange}>
						    <Option value="newest">newest</Option>
						    <Option value="oldest">oldest</Option>
						    <Option value="popular">popular</Option>
					  	</Select>
					  </Col>
		      </Row>

			  <ListShow data={this.props.shortLinks.allLinks} />
      </div>
    );
  }
}

export default ListLinks;