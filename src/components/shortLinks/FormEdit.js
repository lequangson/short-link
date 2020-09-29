import React from "react";
import { Form, Input, Button, Modal } from "antd";
import { inject, observer } from "mobx-react";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

const handleSubmit = (props) => (e) => {
  const { shortLinks, listSelect, idEdit, fullUrl } = props;
  e.preventDefault();
  const exSub = /(http(s)?:\/\/)|(\/.*){1}/g;
  let subUrl, mainUrl;
  if (fullUrl) {
    mainUrl = `http://${fullUrl.replace(exSub, "")}`;
    subUrl = fullUrl.match(exSub)[1] || fullUrl.match(exSub)[0];
  }
  props.form.validateFields((err, values) => {
    if (!err) {
      if (idEdit) {
        const dataForSend = { code: idEdit };
        if (values.main || mainUrl) dataForSend.main_url = values.main || mainUrl;
        if (values.sub || subUrl) dataForSend.sub_url = values.sub || subUrl;
        shortLinks
          .edit({
            data: dataForSend,
            type: "single",
          })
          .then(
            (error) => error || props.form.setFieldsValue({ main: "", sub: "" })
          );
      } else {
        shortLinks.edit({
          data: {
            codes: listSelect,
            main_url: values.main || mainUrl,
          },
        });
      }
    }
  });
};

function renderEditDetail({ hideModal, props }) {
  return (
    <Modal
      title="change all link"
      visible
      centered
      onOk={handleSubmit(props)}
      onCancel={hideModal}
    >
      <form onSubmit={handleSubmit(props)}>
        <input
          type="text"
          name="fullUrl"
          className="form-control"
          id="fullUrl"
          placeholder="fullUrl"
          onChange={(event) => {
            props.fullUrl = event.target.value;
          }}
        />
      </form>
    </Modal>
  );
}
@inject("shortLinks", "commonStore")
@observer
class FormEdit extends React.Component {
  state = { idEdit: "" };

  static getDerivedStateFromProps(props, state) {
    const { commonStore, idEdit } = props;
    const { queueModal, hideModal } = commonStore || {};
    if (idEdit && idEdit !== (state && state.idEdit)) {
      queueModal({
        modalType: renderEditDetail,
        modalProps: { hideModal, props },
      });
      return { idEdit };
    }
    return null;
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  render() {
    const { idEdit, form } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = form;

    // Only show error after a field is touched.
    const mainError = isFieldTouched("main") && getFieldError("main");
    const subError = isFieldTouched("sub") && getFieldError("sub");
    return idEdit ? (
      <Form layout="inline" onSubmit={handleSubmit(this.props)}>
        <Form.Item
          validateStatus={mainError ? "error" : ""}
          help={mainError || ""}
        >
          {getFieldDecorator("main", {
            rules: [{ message: "không được để trống!" }],
          })(<Input placeholder="Main" />)}
        </Form.Item>
        <Form.Item
          validateStatus={subError ? "error" : ""}
          help={subError || ""}
        >
          {getFieldDecorator("sub", {
            rules: [{ message: "không được để trống!" }],
          })(
            <Input
              //   prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Sub"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Sửa!
          </Button>
        </Form.Item>
      </Form>
    ) : (
      <Form layout="inline" onSubmit={handleSubmit(this.props)}>
        <Form.Item
          validateStatus={mainError ? "error" : ""}
          help={mainError || ""}
        >
          {getFieldDecorator("main", {
            rules: [{ required: true, message: "không được để trống!" }],
          })(<Input placeholder="Main" />)}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Sửa!
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({ name: "horizontal" })(FormEdit);
