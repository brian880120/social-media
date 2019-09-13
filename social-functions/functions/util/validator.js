const isEmpty = (input) => {
    return input.trim() === '';
};

const isEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validateSignupData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Email must not be valid';
    }

    if (isEmpty(data.password)) {
        errors.password = 'Must not empty';
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'password must match';
    }

    if (isEmpty(data.handle)) {
        errors.handle = 'Must not empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

const validateLoginData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'must not be empty';
    }

    if (isEmpty(data.password)) {
        errors.password = 'must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

module.exports = { validateSignupData, validateLoginData };
