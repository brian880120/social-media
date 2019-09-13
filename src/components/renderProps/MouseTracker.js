import React from 'react';

class Cat extends React.Component {
    render() {
        const mouse = this.props.mouse;

        return (
            <div style={{height: '100px', width: '100px', backgroundColor: 'brown', position: 'absolute', left: mouse.x, top: mouse.y}}></div>
        );
    }
}

class Mouse extends React.Component {
    state = {
        x: 0,
        y: 0,
    };
    
    handleMouseMove = (event) => {
        this.setState({
            x: event.clientX,
            y: event.clientY,
        });
    };

    render() {
        return (
            <div style={{height: '100%'}} onMouseMove={this.handleMouseMove}>
                {this.props.render(this.state)}
            </div>
        );
    }
}

class MouseTracker extends React.Component {
    renderChildren = (mouse) => {
        return (
            <Cat mouse={mouse} />
        );
    };

    render() {
        return (
            <div>
                <h1>Move the mouse around!</h1>
                <Mouse render={this.renderChildren} />
            </div>
        );
    }
}

export default MouseTracker;
