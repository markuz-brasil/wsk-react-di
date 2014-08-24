import {MainSection} from './components/MainSection.react';
import {Injector} from 'di'

var render = () => React.renderComponent(
    <MainSection />,
    document.getElementById('react-content')
);

render();
