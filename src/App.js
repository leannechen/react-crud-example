import React from 'react';
import './App.css';
import Modal from './Modal';

class App extends React.Component{

  state = {
    userList: [
      {
        serialNo: 1,
        name: 'User1',
        phone: '02-12345678',
        email: 'aaa@mail.com',
      },
      {
        serialNo: 2,
        name: 'User2',
        phone: '02-12345678',
        email: 'bbb@mail.com',
      },
      {
        serialNo: 3,
        name: 'User3',
        phone: '02-12345678',
        email: 'ccc@mail.com',
      },
      {
        serialNo: 4,
        name: 'User4',
        phone: '02-12345678',
        email: 'ddd@mail.com',
      },
      {
        serialNo: 5,
        name: 'User5',
        phone: '02-12345678',
        email: 'eee@mail.com',
      },
    ],
    isShowModal: false,
    editingUserSerialNo: 0, // Editing user's serial number. If 0, means create.
  };

  handleModalClose = () => {
    this.setState({
      isShowModal: false,
      editingUserSerialNo: 0,
    });
  };

  handleModalSubmit = ({ isCreateUser, editingUser }) => {

    const { userList } = this.state;

    if(isCreateUser) {
      this.setState({
        userList: [...userList, editingUser],
      })
    } else {
      const updatedUserList = userList.map((user) => {
        return user.serialNo === editingUser.serialNo?
          editingUser
          :
          user;
      });
      this.setState({
        userList: updatedUserList,
      })
    }

    this.handleModalClose();
  };

  handleUserEdit = (serialNo) => () => {
    this.setState({
      isShowModal: true,
      editingUserSerialNo: serialNo,
    });
  };

  handleUserCreate = () => {
    this.setState({
      isShowModal: true,
      editingUserSerialNo: 0,
    });
  };

  handleUserDelete = (serialNo) => () => {
    const { userList } = this.state;
    const updatedUserList = userList
      // Remove specified user
      .filter((user) => user.serialNo !== serialNo)
      // Set new serialNo
      .map((user, idx) => ({
        ...user,
        serialNo: idx + 1,
      }));
    this.setState({
      userList: updatedUserList,
    });
  };

  renderUserList = () => {
    const { userList } = this.state;
    return userList.map((user) => {
      const { name, phone, email, serialNo } = user;
      return (
        <tr key={serialNo} className="tr">
          <td className="td cell--center" data-label="NO.">{serialNo}</td>
          <td className="td" data-label="NAME">{name}</td>
          <td className="td" data-label="PHONE">{phone}</td>
          <td className="td" data-label="EMAIL">{email}</td>
          <td className="td cell--center" data-label="EDIT">
            <button
              className="btn btn-action"
              onClick={this.handleUserEdit(serialNo)}
            >
              <i className="fas fa-edit"/>
            </button>
          </td>
          <td className="td cell--center" data-label="DELETE">
            <button
              className="btn btn-action btn-delete"
              onClick={this.handleUserDelete(serialNo)}
            >
              <i className="fas fa-trash-alt"/>
            </button>
          </td>
        </tr>
      )
    })
  };

  render(){

    const { isShowModal, editingUserSerialNo, userList } = this.state;

    return(
      <div className="wrapper">
        <div className="title-container">
          <h2 className="title">User List</h2>
          <button className="btn btn-add" onClick={this.handleUserCreate}>
            <i className="fas fa-plus-circle"></i>
            <span>Add</span>
          </button>
        </div>

        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th cell--narrow cell--center">NO.</th>
              <th className="th">NAME</th>
              <th className="th">PHONE</th>
              <th className="th">EMAIL</th>
              <th className="th cell--narrow cell--center">EDIT</th>
              <th className="th cell--narrow cell--center">DELETE</th>
            </tr>
          </thead>
          <tbody>
            { this.renderUserList() }
          </tbody>
        </table>

        { isShowModal &&
          <Modal
            editingUserSerialNo={editingUserSerialNo}
            userList={userList}
            onClose={this.handleModalClose}
            onSubmit={this.handleModalSubmit}
          />
        }
      </div>
    )
  }
}

export default App;