import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom';
import {
    Panel,
    Icon
} from 'react-uikits';
import 'react-uikits/less/main.less';
import uuidv4 from 'uuid/v4';
import 'whatwg-fetch';

import {
    Card,
    CardList,
} from './view/CardView';

const defaultUser = {
    name: 'jerry',
    age: 12,
    sex: 'm',
    id: uuidv4(),
}

const fetchFromCacheByUrl = async (url) => {
    let result = null
    if ('caches' in window) {
        const res = await caches.match(url)
        if (res) {
            result = await res.json()
        }
    }
    return result
}

export class App extends Component {
    constructor(props) {
        super(props)
        this.addUser = this.addUser.bind(this)
        this.state = {
            users: [],
            loading: false,
        }
    }

    async loadable(cb, loadState = 'loading') {
        this.setState({
            [loadState]: true
        }, async () => {
            await cb()
            this.setState({
                [loadState]: false
            });
        });
    }

    async componentWillMount() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(() => console.log('service worker registered'))
        }
        this.loadable(async () => {
            const user = await this.loadUser()
            this.setState(state => {
                return {
                    users: [
                        ...state.users,
                        user
                    ]
                }
            });
        })
    }

    async loadUser() {
        const cachedUser = await fetchFromCacheByUrl('/api/user')
        
        if (cachedUser) {
            fetch('/api/user')
            return cachedUser
        }

        const res = await fetch('/api/user')
        return await res.json()
    }

    async addUser() {
        const { users } = this.state
        const user = await this.loadUser()
        const newUsers = [
            ...users,
            user,
        ]
        this.setState({
            users: newUsers
        });
    }

    render() {
        const { users, loading } = this.state
        return (
            <div className="dot grid">
                <div className="row">
                    <div className="column-4">
                        <h3>Hello pwa</h3>
                        <Icon>email</Icon>
                        <img src="/images/demo.jpg" className="dot image" alt=""/>
                    </div>
                    <div className="column-12">
                        <Panel>
                            <div className="text-right field">
                                <button 
                                    className="dot blue icon button"
                                    onClick={this.addUser}
                                >
                                    <Icon>add</Icon>
                                    add
                                </button>
                            </div>
                            <CardList 
                                loading={loading}
                                users={users}
                            />
                        </Panel>
                    </div>
                </div>
            </div>
        );
    }
}

if (module.hot) {
    module.hot.accept()
}

ReactDOM.render(<App/>, document.getElementById('root'))