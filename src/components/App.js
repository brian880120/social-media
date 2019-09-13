import React from 'react';
import { connect } from 'react-redux';
import { fetchData } from '../actions/test.action';
import './App.css';

class App extends React.Component {
    onClick = () => {
        this.props.fetchData('test');
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <button onClick={this.onClick}>test</button>
                </div>
            </React.Fragment>
        );
    }
}

const actions = {
    fetchData,
};

export default connect(null, actions)(App);
