## How to use

1. Install application related packages: `npm install`
1. Development: `npm run start`
1. Build: `npm run build`

## Design Principle

### About design
1. Implement Responsive web design

### About the list
1. Render user list with unique key, which is designated `serialNo`
1. Use this `serialNo` to decide which user to edit, which user to remove
1. If serialNo equals to 0, the editing user is a new one; if any number(1,2,3...), the editing user is an existing one
1. If user list updated (add/delete), users' serialNo will be re-assigned with new order

### About the form
1. It's placed inside Modal because only Modal needs the information
1. A form contains needed fields objects
1. Every field has its own object with value and error message
1. Whether a field is valid or not depends on its error message string. If valid, it's empty; If invalid, it will be why it's invalid
1. If input is changed (touched), matching error message will show accordingly
1. Since we have to compare user name's uniqueness, `userList` is passed in to Modal
1. When submit, check all fields' validity. If any is invalid, update error messages of them. If all are valid, use editing `serialNo` to decide whether it is create or edit, and pass value to callback function from outside
