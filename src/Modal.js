import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

class Modal extends React.PureComponent{

  static defaultProps = {
    onClose: () => {},
    onSubmit: () => {},
    editingUserSerialNo: 0,
    userList: [],
  };

  state = {
    fieldNameList: ['name', 'phone', 'email'],
    name: {
      value: '',
      errorMsg: '',
    },
    phone: {
      value: '',
      errorMsg: '',
    },
    email: {
      value: '',
      errorMsg: '',
    },
  };

  componentDidMount() {

    // Assemble form from editingUserSerialNo
    const { userList, editingUserSerialNo } = this.props;
    const { name, phone, email } = this.state;

    // Find matching user. If user already existed, set value with it
    const user = userList.find((user) => user.serialNo === editingUserSerialNo);
    const isUserExist = (typeof user === 'object');
    if(isUserExist) {
      this.setState({
        name: {
          ...name,
          value: user.name,
        },
        phone: {
          ...phone,
          value: user.phone,
        },
        email: {
          ...email,
          value: user.email,
        },
      }
      )
    }
  }

  handleInputChange = (fieldName) => (e) => {

    const errorMsg = this.validator({ fieldName, value: e.target.value });

    // Validate, make touched and change value
    this.setState({
      [fieldName]: {
        value: e.target.value,
        errorMsg,
      }
    })
  };

  validator = ({ fieldName, value }) => {

    const { userList, editingUserSerialNo } = this.props;

    switch (fieldName) {
      case 'name':
        // Check whether name is duplicated
        const isNameDuplicated = userList
          .filter((user) => user.serialNo !== editingUserSerialNo)
          .some((user) => user.name === value);

        if(value.length === 0) {
          return 'Required';
        } else if (isNameDuplicated) {
          return 'Name can not be duplicated';
        } else return '';

      case 'phone':
        const phonePtrn = /^[\d\+\-]{1,}$/; // 0-9, +, - only
        return !phonePtrn.test(value)? 'Please enter digit and character "+, -" only': '';
      case 'email':
        const emailPtrn = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        return !emailPtrn.test(value)? 'Please enter in email format': '';
    }

    return '';
  };

  handleSubmit = () => {
    const { fieldNameList, name, phone, email } = this.state;
    const { editingUserSerialNo, userList } = this.props;

    const allFieldsValidated = fieldNameList.reduce((acc, fieldName) => {

      return {
        ...acc,
        [fieldName]: {
          ...this.state[fieldName],
          errorMsg: this.validator({
            fieldName,
            value: this.state[fieldName].value
          }),
        }
      }
    }, {});

    const isAnyFieldInvalid = fieldNameList.some((fieldName) => allFieldsValidated[fieldName].errorMsg !== '');

    if(isAnyFieldInvalid) {
      this.setState(allFieldsValidated);
    } else {

      const isCreateUser = editingUserSerialNo === 0;
      // submit
      this.props.onSubmit({
        isCreateUser,
        editingUser: {
          serialNo: isCreateUser? userList.length + 1: editingUserSerialNo,
          name: name.value,
          phone: phone.value,
          email: email.value,
        }
      })
    }

  };

  render() {

    const { onClose, editingUserSerialNo } = this.props;
    const { name, phone, email } = this.state;

    return (
      ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-closeable-area" onClick={onClose} />
          <div className="modal">
            <div className="modal-top">
              <h3 className="modal-title">
                { editingUserSerialNo > 0 ? 'Edit User': 'Create User' }
              </h3>
              <button className="btn modal-btn-close" onClick={onClose}>
                <i className="fas fa-times" />
              </button>
            </div>
            <label className="label">
              <span className="label-span">Name</span>
              <input
                type="text"
                className="input"
                key="name"
                value={name.value}
                onChange={this.handleInputChange('name')}
              />
              <span className="label-error-msg">{name.errorMsg}</span>
            </label>
            <label className="label">
              <span className="label-span">Phone</span>
              <input
                type="tel"
                className="input"
                key="phone"
                value={phone.value}
                onChange={this.handleInputChange('phone')}
              />
              <span className="label-error-msg">{phone.errorMsg}</span>
            </label>
            <label className="label">
              <span className="label-span">Email</span>
              <input
                type="email"
                className="input"
                key="email"
                value={email.value}
                onChange={this.handleInputChange('email')}
              />
              <span className="label-error-msg">{email.errorMsg}</span>
            </label>
            <div className="btn-container">
              <button
                className="btn btn-cancel"
                key="cancel"
                onClick={onClose}
              >Cancel</button>
              <button
                className="btn btn-submit"
                key="submit"
                onClick={this.handleSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>,
        document.getElementById('app'),
      )
    )
  }
}

export default Modal;