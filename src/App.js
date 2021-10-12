import React, { Component } from 'react'
import { Container, Table, Spinner } from 'react-bootstrap'
import './App.css'

export default class App extends Component {

  state = {
    loadingBottom: false, // loader state for bottom scroll
    loadingTop: false, // loader state for top scroll
    startingIndex: 0, //Starting Index of Array
    endingIndex: 8, //Ending Index of Array
    incrementingValue: 10, // Increamenting Value
    displayingArray: [], // Array List to View
    dumpedArray: [], // Array List to dumped previous Value
    actualArray: [] // Actual Array List
  }

  componentDidMount() {
    //Fetching the Results from API
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => {
        this.setState({
          actualArray: json, // Stored Complete Json in actual Array
          displayingArray: json.slice(this.state.startingIndex, this.state.endingIndex), // Stored a list of array form startingIndex to endingIndex in displayingArray
          dumpedArray: json.slice(this.state.startingIndex, this.state.endingIndex) // Stored a list of array form startingIndex to endingIndex in dumpedArray
        })
      }
      )
  }

  scroller = () => {
    var parentElement = document.getElementById("scrollDiv"); // storing parent div element Reference using getElementById in parentElement
    if (parentElement.scrollHeight - parentElement.scrollTop === parentElement.clientHeight) { // If Condition to check does scroll hit bottom position
      if (this.state.endingIndex !== this.state.actualArray.length) { // If condition to run below code until endingIndex will equal to actualArray length
        let remainingIndex = this.state.actualArray.length - this.state.dumpedArray.length; // storing the remaining objects by calculating the difference between actualArray length and dumpedArray length
        if (this.state.incrementingValue > remainingIndex) { //If Condition to check the incrementingValue is greater than remainingIndex value so we only add the remaining value in displaying Array
          this.setState({
            loadingBottom: true, //Loader state to true
            startingIndex: this.state.actualArray.length - this.state.incrementingValue, // if incrementingValue is greater than remainingIndex value the starting index will become actualArray.length - incrementingValue so we see the remaining objects
            endingIndex: this.state.endingIndex + remainingIndex, //  if incrementingValue is greater than remainingIndex value than the endingIndex will ending+remainingIndex
            dumpedArray: this.state.dumpedArray.concat(this.state.actualArray.slice(this.state.endingIndex, this.state.endingIndex + remainingIndex)) // pushed those objects in dumpedArray
          })
        }
        else {
          this.setState({
            loadingBottom: true, //Loader state true
            startingIndex: this.state.endingIndex, //if incrementingValue is not greater than remainingIndex value then starting index will be the ending index
            endingIndex: this.state.endingIndex + this.state.incrementingValue, //if incrementingValue is not greater than remainingIndex value the endingIndex is equal to endingIndex+incrementingValue
            dumpedArray: this.state.dumpedArray.concat(this.state.actualArray.slice(this.state.endingIndex, this.state.endingIndex + this.state.incrementingValue)) // pushed those objects in dumpedArray
          })
        }
        setTimeout(() => { //setTimeout for loading spinner for 1 second
          this.setState(
            {
              displayingArray: this.state.actualArray.slice(this.state.startingIndex, this.state.endingIndex), // displayingArray with the new Starting and ending index Value
              loadingBottom: false // loader state false
            }
          )
          parentElement.scrollTop = 1; // scrollTop set to 1 so user can see the value from the top again
        }, 1000)
      }
    }

    if (parentElement.scrollTop === 0) { // If Condition to check does scroll hit top position  
      if (this.state.startingIndex !== 0) {  // If condition to run below code until startingIndex will again set to zero (0)
        if (this.state.startingIndex < this.state.incrementingValue) {  // If condition to check startingIndex will become less than incrementingValue so we add objects from 0 to incrementing Value
          this.setState({
            loadingTop: true, //loading state true
            startingIndex: 0, //set starting index to zero
            endingIndex: this.state.incrementingValue, // set ending index to incrementingValue
          })
        }
        else {
          this.setState({
            loadingTop: true, //loading state true
            startingIndex: this.state.startingIndex - this.state.incrementingValue, //set startingindex to startingindex-incrementingValue
            endingIndex: this.state.endingIndex - this.state.incrementingValue, //set endingIndex to endingIndex-incrementingValue
          })
        }

        setTimeout(() => { //setTimeout for loading spinner for 1 second
          this.setState(
            {
              displayingArray: this.state.dumpedArray.slice(this.state.startingIndex, this.state.endingIndex),// displayingArray with the new Starting and ending index Value
              loadingTop: false, //loading state false
              dumpedArray: this.state.dumpedArray.slice(0, this.state.endingIndex) // pop out the last incremented values
            }
          )
          parentElement.scrollTop = 1; // scrollTop set to 1 so user can see the value from the top again
        }, 1000)

      }
    }
  }



  render() {
    const { loadingBottom, loadingTop, displayingArray } = this.state;
    return (
      <Container>
        {/* <Row> */}
        <div id='scrollDiv' onScroll={() => this.scroller()} style={{ height: '380px', overflow: 'scroll' }}>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User Id</th>
                <th>Id</th>
                <th>Title</th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {loadingTop ?
                <tr className="text-center">
                  <td colSpan="4">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
                : null}
              {displayingArray.map((i, index) => (

                <tr key={index}>
                  <td>{i.userId}</td>
                  <td>{i['id']}</td>
                  <td>{i['title']}</td>
                  <td>{i['body']}</td>
                </tr>
              )
              )}
              {loadingBottom ?
                <tr className="text-center">
                  <td colSpan="4">
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
                : null}

            </tbody>
          </Table>
        </div>
      </Container>
    )
  }
}
