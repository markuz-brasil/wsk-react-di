import {Body} from './Body.react';


class _MainSection {
    render() {
        return (
            <div>
                <h3>Example of React with es6 and webpack</h3>
                <Body />
            </div>
        );
    }
}
export var MainSection = React.createClass(_MainSection.prototype);
