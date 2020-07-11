class BaseController {
  formErr(err) {
    console.log(err);
    let validationErrors = [];
    let field;
    for (field in err.errors) {
      validationErrors.push({ msg: err.errors[field].message });
    }
    return validationErrors;
  }
}

module.exports = BaseController;
