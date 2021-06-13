import './App.css';
import React, {Component} from 'react'

const BASE_URL = 'http://localhost:8080/api/'

class App extends Component{
  
  state = {
    incomplete: [],
    complete: [],
    newTask: ""
  }

componentDidMount() {
  const url = `${BASE_URL}todos`;
  console.log(url)
  fetch(url)
    .then((result) => result.json())
    .then(({incomplete, complete}) => {
      this.setState({ incomplete, complete })
    })
}

incompleteTodos() {
  const { incomplete } = this.state;
  const result = incomplete.map((task, idx) => 
    <li key={idx}>
      <input onChange={(e) => {this.handleRadioSelect(idx, e)}} type="radio" value={idx}/>
      <label>{task}</label>
    </li>
  );
  return <ul>{result}</ul>;
}

completeTodos() {
  const {complete} = this.state;
  const result = complete.map((task, idx) => <li key={idx}>{task}</li>);
  return <ul>{result}</ul>
}

handleRadioSelect(idx, e) {
  const {incomplete, complete} = this.state;
  const removed = incomplete.splice(idx, 1);
  complete.push(...removed);
  const url = `${BASE_URL}updateTodos`;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incomplete, complete })
  })
  .then(res => res.json())
  .then(({incomplete, complete}) => {
    this.setState({incomplete, complete})
    e.target.checked = false;
  })

}

handleChange(event) {
  this.setState({ newTask: event.target.value });
}

handleClick() {
  const {incomplete, complete} = this.state;
  incomplete.unshift(this.state.newTask);
  const url = `${BASE_URL}updateTodos`;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incomplete, complete })
  })
  .then(res => res.json())
  .then(({incomplete, complete}) => {
    this.setState({incomplete, complete, newTask: ""})
  })
}

render() {
  return (
    <div className="App">
      <h1>A Crappy Todo REACT App</h1>
      <input type="text" 
        value={this.state.newTask} 
        placeholder="add a task"
        onChange={(event) => this.handleChange(event)}
      ></input>
      <button onClick={() => this.handleClick()}>add</button>
      <h2>Tasks:</h2>
      {this.incompleteTodos()}
      <h2>Complete:</h2>
      {this.completeTodos()}
    </div>
  );
}
}

export default App;
