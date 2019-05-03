import React from 'react'
import { Form, Input, Button } from 'antd'
import { inject, observer } from 'mobx-react'

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

@inject('shortLinks')
@observer
class FormEdit extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = e => {
    const { shortLinks, listSelect, idEdit } = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (idEdit) {
          const dataForSend = { code: idEdit }
          if (values.main) dataForSend.main_url = values.main
          if (values.sub) dataForSend.sub_url = values.sub
          shortLinks.edit({
            data: dataForSend,
            type: 'single',
          })
        } else {
          shortLinks.edit({
            data: {
              codes: listSelect,
              main_url: values.main,
            },
          })
        }
      }
    })
  }

  render() {
    const { idEdit, form } = this.props
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = form

    // Only show error after a field is touched.
    const mainError = isFieldTouched('main') && getFieldError('main')
    const subError = isFieldTouched('sub') && getFieldError('sub')
    return idEdit ? (
      <Form layout='inline' onSubmit={this.handleSubmit}>
        <Form.Item
          validateStatus={mainError ? 'error' : ''}
          help={mainError || ''}>
          {getFieldDecorator('main', {
            rules: [{ message: 'không được để trống!' }],
          })(<Input placeholder='Main' />)}
        </Form.Item>
        <Form.Item
          validateStatus={subError ? 'error' : ''}
          help={subError || ''}>
          {getFieldDecorator('sub', {
            rules: [{ message: 'không được để trống!' }],
          })(
            <Input
              //   prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Sub'
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            disabled={hasErrors(getFieldsError())}>
            Sửa!
          </Button>
        </Form.Item>
      </Form>
    ) : (
      <Form layout='inline' onSubmit={this.handleSubmit}>
        <Form.Item
          validateStatus={mainError ? 'error' : ''}
          help={mainError || ''}>
          {getFieldDecorator('main', {
            rules: [{ required: true, message: 'không được để trống!' }],
          })(<Input placeholder='Main' />)}
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            disabled={hasErrors(getFieldsError())}>
            Sửa!
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'horizontal' })(FormEdit)
