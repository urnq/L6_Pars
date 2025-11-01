document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('app').innerHTML = '<div class="container">Загрузка...</div>';
        });
        const Utils = { 
            createElement(tag, attributes = {}, children = []) {
                const element = document.createElement(tag);
                
                Object.keys(attributes).forEach(key => {
                    if (key.startsWith('on') && typeof attributes[key] === 'function') {
                        const eventName = key.slice(2).toLowerCase();
                        element.addEventListener(eventName, attributes[key]);
                    } else {
                        element.setAttribute(key, attributes[key]);
                    }
                });
                
                children.forEach(child => {
                    if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    } else {
                        element.appendChild(child);
                    }
                });
                
                return element;
            },
            
            debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            },
            
            getFromStorage(key) {
                try {
                    return JSON.parse(localStorage.getItem(key)) || [];
                } catch (e) {
                    console.error('Error reading from localStorage', e);
                    return [];
                }
            },
            
            saveToStorage(key, data) {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                } catch (e) {
                    console.error('Error saving to localStorage', e);
                }
            }
        };

        const ApiService = {
            async fetchUsers() {
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/users');
                    if (!response.ok) throw new Error('Failed to fetch users');
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching users:', error);
                    return [];
                }
            },
            
            async fetchTodos() {
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
                    if (!response.ok) throw new Error('Failed to fetch todos');
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching todos:', error);
                    return [];
                }
            },
            
            async fetchPosts() {
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
                    if (!response.ok) throw new Error('Failed to fetch posts');
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching posts:', error);
                    return [];
                }
            },
            
            async fetchComments() {
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
                    if (!response.ok) throw new Error('Failed to fetch comments');
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching comments:', error);
                    return [];
                }
            }
        };

        const Components = {
    Breadcrumbs(currentRoute) {
        const routes = [
            { path: '#users', name: 'Пользователи' },
            { path: '#users#todos', name: 'Задачи' },
            { path: '#users#posts', name: 'Посты' },
            { path: '#users#posts#comments', name: 'Комментарии' }
        ];
        
        const breadcrumbsContainer = Utils.createElement('div', { className: 'breadcrumbs' });
        
        const homeLink = Utils.createElement('a', { href: '#users' }, ['Главная']);
        breadcrumbsContainer.appendChild(homeLink);
        
        routes.forEach(route => {
            if (currentRoute.includes(route.path.replace('#', ''))) {
                const separator = Utils.createElement('span', {}, [' / ']);
                const link = Utils.createElement('a', { href: route.path }, [route.name]);
                
                breadcrumbsContainer.appendChild(separator);
                breadcrumbsContainer.appendChild(link);
            }
        });
        
        return breadcrumbsContainer;
    },

     Header(currentRoute) {
        const header = Utils.createElement('header');
        const container = Utils.createElement('div', { className: 'container header-content' });
        
        const logo = Utils.createElement('div', { className: 'logo' }, ['SPA App']);
        
        const nav = Utils.createElement('nav');
        const navList = Utils.createElement('ul');
        
        const routes = [
            { path: '#users', name: 'Пользователи' },
            { path: '#users#todos', name: 'Задачи' },
            { path: '#users#posts', name: 'Посты' },
            { path: '#users#posts#comments', name: 'Комментарии' }
        ];
        
        routes.forEach(route => {
            const li = Utils.createElement('li');
            const a = Utils.createElement('a', { 
                href: route.path,
                className: currentRoute === route.path ? 'active' : ''
            }, [route.name]);
            
            li.appendChild(a);
            navList.appendChild(li);
        });
        
        nav.appendChild(navList);
        container.appendChild(logo);
        container.appendChild(nav);
        header.appendChild(container);
        
        return header;
    },

    Footer() {
        return Utils.createElement('footer', { className: 'container' }, [
            Utils.createElement('p', {}, ['© 2025 SPA App. Все права защищены.'])
        ]);
    },

    LoadingState() {
        return Utils.createElement('div', { className: 'loading' }, ['Загрузка...']);
    },
    
    ErrorState(message) {
        return Utils.createElement('div', { className: 'error' }, [message]);
    },

    SearchInput(onSearch) {
        const debouncedSearch = Utils.debounce(onSearch, 300);
        
        return Utils.createElement('div', { className: 'search-container' }, [
            Utils.createElement('input', {
                type: 'text',
                className: 'search-input',
                placeholder: 'Поиск...',
                onInput: (e) => debouncedSearch(e.target.value)
            })
        ]);
    },

     AddUserForm(onAddUser) {
        const form = Utils.createElement('form', { className: 'add-form' });
        
        const title = Utils.createElement('h3', {}, ['Добавить пользователя']);
        
        const nameGroup = Utils.createElement('div', { className: 'form-group' }, [
            Utils.createElement('label', { for: 'user-name' }, ['Имя']),
            Utils.createElement('input', { 
                type: 'text', 
                id: 'user-name',
                required: true 
            })
        ]);
        },

                    UserList(users, searchQuery, onDeleteUser) {
                const container = Utils.createElement('div');
     
                const filteredUsers = users.filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredUsers.length === 0) {
                    const emptyState = Utils.createElement('div', { className: 'empty-state' }, [
                        Utils.createElement('h3', {}, ['Пользователи не найдены']),
                        Utils.createElement('p', {}, ['Попробуйте изменить поисковый запрос'])
                    ]);
                    container.appendChild(emptyState);
                    return container;
                }
                
                filteredUsers.forEach(user => {
                    const isCustomUser = user.id < 0;
                    
                    const card = Utils.createElement('div', { className: 'card user-card' }, [
                        Utils.createElement('h3', {}, [user.name]),
                        Utils.createElement('p', {}, [user.email]),
                        Utils.createElement('div', { className: 'meta' }, [
                            Utils.createElement('p', {}, [`Город: ${user.address?.city || 'Не указан'}`]),
                            Utils.createElement('p', {}, [`Телефон: ${user.phone || 'Не указан'}`])
                        ])
                    ]);
                    
        
                    if (isCustomUser) {
                        const actionButtons = Utils.createElement('div', { className: 'action-buttons' });
                        const deleteBtn = Utils.createElement('button', { 
                            className: 'btn btn-danger',
                            onClick: () => onDeleteUser(user.id)
                        }, ['Удалить']);
                        
                        actionButtons.appendChild(deleteBtn);
                        card.appendChild(actionButtons);
                    }
                    
                    container.appendChild(card);
                });
                
                return container;
            },
            
            TodoList(todos, searchQuery) {
                const container = Utils.createElement('div');
                

                const filteredTodos = todos.filter(todo => 
                    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredTodos.length === 0) {
                    const emptyState = Utils.createElement('div', { className: 'empty-state' }, [
                        Utils.createElement('h3', {}, ['Задачи не найдены']),
                        Utils.createElement('p', {}, ['Попробуйте изменить поисковый запрос'])
                    ]);
                    container.appendChild(emptyState);
                    return container;
                }
                
                filteredTodos.forEach(todo => {
                    const card = Utils.createElement('div', { className: 'card todo-card' }, [
                        Utils.createElement('h3', {}, [todo.title]),
                        Utils.createElement('div', { className: 'meta' }, [
                            Utils.createElement('p', {}, [
                                `Статус: ${todo.completed ? 'Выполнено' : 'Не выполнено'}`
                            ]),
                            Utils.createElement('p', {}, [`Пользователь ID: ${todo.userId}`])
                        ])
                    ]);
                    
                    container.appendChild(card);
                });
                
                return container;
            },
            
            PostList(posts, searchQuery) {
                const container = Utils.createElement('div');
                
       
                const filteredPosts = posts.filter(post => 
                    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    post.body.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredPosts.length === 0) {
                    const emptyState = Utils.createElement('div', { className: 'empty-state' }, [
                        Utils.createElement('h3', {}, ['Посты не найдены']),
                        Utils.createElement('p', {}, ['Попробуйте изменить поисковый запрос'])
                    ]);
                    container.appendChild(emptyState);
                    return container;
                }
                
                filteredPosts.forEach(post => {
                    const card = Utils.createElement('div', { className: 'card post-card' }, [
                        Utils.createElement('h3', {}, [post.title]),
                        Utils.createElement('p', {}, [post.body]),
                        Utils.createElement('div', { className: 'meta' }, [
                            Utils.createElement('p', {}, [`Пользователь ID: ${post.userId}`])
                        ])
                    ]);
                    
                    container.appendChild(card);
                });
                
                return container;
            },
            
            CommentList(comments, searchQuery) {
                const container = Utils.createElement('div');
        
                const filteredComments = comments.filter(comment => 
                    comment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    comment.body.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredComments.length === 0) {
                    const emptyState = Utils.createElement('div', { className: 'empty-state' }, [
                        Utils.createElement('h3', {}, ['Комментарии не найдены']),
                        Utils.createElement('p', {}, ['Попробуйте изменить поисковый запрос'])
                    ]);
                    container.appendChild(emptyState);
                    return container;
                }
                
                filteredComments.forEach(comment => {
                    const card = Utils.createElement('div', { className: 'card comment-card' }, [
                        Utils.createElement('h3', {}, [comment.name]),
                        Utils.createElement('p', {}, [comment.body]),
                        Utils.createElement('div', { className: 'meta' }, [
                            Utils.createElement('p', {}, [`Email: ${comment.email}`]),
                            Utils.createElement('p', {}, [`Пост ID: ${comment.postId}`])
                        ])
                    ]);
                    
                    container.appendChild(card);
                });
                
                return container;
            },

             LoadingState() {
                return Utils.createElement('div', { className: 'loading' }, ['Загрузка...']);
            },
            
       
            ErrorState(message) {
                return Utils.createElement('div', { className: 'error' }, [message]);
            },
            
        
            Footer() {
                return Utils.createElement('footer', { className: 'container' }, [
                    Utils.createElement('p', {}, ['© 2025 SPA App. Все права защищены.'])
                ]);
            }
        };


        class App {
            constructor() {
                this.state = {
                    currentRoute: window.location.hash || '#users',
                    users: [],
                    todos: [],
                    posts: [],
                    comments: [],
                    searchQuery: '',
                    loading: false,
                    error: null
                };
                
                this.customUsers = Utils.getFromStorage('customUsers');
                this.customTodos = Utils.getFromStorage('customTodos');
                
                this.init();
            }
            
            async init() {
                this.setupEventListeners();
                await this.loadData();
                this.render();
            }
            
            setupEventListeners() {
         
                window.addEventListener('hashchange', () => {
                    this.state.currentRoute = window.location.hash;
                    this.state.searchQuery = '';
                    this.render();
                });
            }
            
            async loadData() {
                this.state.loading = true;
                this.render();
                
                try {
                
                    const [apiUsers, apiTodos, apiPosts, apiComments] = await Promise.all([
                        ApiService.fetchUsers(),
                        ApiService.fetchTodos(),
                        ApiService.fetchPosts(),
                        ApiService.fetchComments()
                    ]);
                    
               
                    this.state.users = [...apiUsers, ...this.customUsers];
                    this.state.todos = [...apiTodos, ...this.customTodos];
                    this.state.posts = apiPosts;
                    this.state.comments = apiComments;
                    
                    this.state.loading = false;
                    this.state.error = null;
                } catch (error) {
                    this.state.loading = false;
                    this.state.error = 'Ошибка загрузки данных. Пожалуйста, попробуйте позже.';
                }
            }
            
            handleSearch(query) {
                this.state.searchQuery = query;
                this.render();
            }
            
            addUser(userData) {
           
                const newUser = {
                    id: -Date.now(),
                    ...userData,
                    address: { city: 'Не указан' },
                    phone: 'Не указан'
                };
                
                this.customUsers.push(newUser);
                Utils.saveToStorage('customUsers', this.customUsers);
                
             
                this.state.users = [...this.state.users, newUser];
                this.render();
            }
            
            deleteUser(userId) {
            
                this.customUsers = this.customUsers.filter(user => user.id !== userId);
                Utils.saveToStorage('customUsers', this.customUsers);
                
        
                this.customTodos = this.customTodos.filter(todo => todo.userId !== userId);
                Utils.saveToStorage('customTodos', this.customTodos);
       
                this.state.users = this.state.users.filter(user => user.id !== userId);
                this.state.todos = this.state.todos.filter(todo => todo.userId !== userId);
                this.render();
            }
            
            render() {
                const app = document.getElementById('app');
                app.innerHTML = '';
                
                // Рендерим заголовок
                app.appendChild(Components.Header(this.state.currentRoute));
                
                const container = Utils.createElement('div', { className: 'container' });
                
              
                container.appendChild(Components.Breadcrumbs(this.state.currentRoute));
                
             
                if (this.state.currentRoute.includes('#users')) {
                    container.appendChild(Components.SearchInput((query) => this.handleSearch(query)));
                }
                
          
                if (this.state.loading) {
                    container.appendChild(Components.LoadingState());
                    app.appendChild(container);
                    return;
                }
                
                if (this.state.error) {
                    container.appendChild(Components.ErrorState(this.state.error));
                    app.appendChild(container);
                    return;
                }
                

                switch (this.state.currentRoute) {
                    case '#users':
                        
                        container.appendChild(Components.AddUserForm((user) => this.addUser(user)));
                
                        container.appendChild(Components.UserList(
                            this.state.users, 
                            this.state.searchQuery,
                            (userId) => this.deleteUser(userId)
                        ));
                        break;
                        
                    case '#users#todos':
                        container.appendChild(Components.TodoList(
                            this.state.todos, 
                            this.state.searchQuery
                        ));
                        break;
                        
                    case '#users#posts':
                        container.appendChild(Components.PostList(
                            this.state.posts, 
                            this.state.searchQuery
                        ));
                        break;
                        
                    case '#users#posts#comments':
                        container.appendChild(Components.CommentList(
                            this.state.comments, 
                            this.state.searchQuery
                        ));
                        break;
                        
                    default:
                      
                        window.location.hash = '#users';
                        break;
                }
                
                app.appendChild(container);
                
            
                app.appendChild(Components.Footer());
            }
        }


        document.addEventListener('DOMContentLoaded', () => {
            new App();
        });