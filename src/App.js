import React from "react";
import "./style.css";

const API = 'https://hn.algolia.com/api/v1/search?query=';

const termsReducer = ( state, action ) => {
  switch(action.type) {
    case('ADD-TERM'):
      let updatedTerms = [...state.terms]
      if (updatedTerms.length > 4) {
        updatedTerms.shift()
        updatedTerms.push( action.payload )
      } else {
        updatedTerms.push(action.payload)
      }
      // console.log(updatedTerms)
      return {
        ...state,
        terms: updatedTerms
      }
  }
}

const dataReducer = (state, action) => {
  switch(action.type) {
    case('LOAD-DATA'):
      // console.log(state)
      return {
        ...state,
        isLoading: true
      }
    case('FETCH-SUCCESS'):
      // console.log(state)
      return {
        ...state,
        isLoading: false,
        data: action.payload
      }
  }
}

export default function App() {
  // state
  // const [searchTerms, setSearchTerms] = React.useState([])
  const [searchTerm, setSearchTerm] = React.useState('')
  
  const [terms, dispatchTerms] = React.useReducer( 
    termsReducer,
    {terms: []}
  )
  const [stories, dispatchData] = React.useReducer(
    dataReducer,
    {data: [], isLoading: false}
  )

  const getData = React.useCallback ( () => {
    dispatchData({
      type: 'LOAD-DATA'
    })
    fetch(`${API}${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        dispatchData({
          type: 'FETCH-SUCCESS',
          payload: result.hits
        })
        // console.log(result.hits)
      })
  }, [searchTerm])
    
  // handlers
  const updateSearches = React.useCallback( (term) => {
    dispatchTerms({
      type: 'ADD-TERM',
      payload: term
    })
  }, [searchTerm])

  const handleSearchSubmit = (event) => {
    updateSearches(searchTerm)
    getData()

    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <h3>Remember searches</h3>

      <SearchForm onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />      
      <p></p>
      {
        terms.terms  
              ? (  
                  <LastSearches 
                    terms={terms.terms}
                  /> 
                )
              : ( <p></p> )

      }
   
      <hr />
      
      {
        stories.isLoading ? (<p>Loading...</p>) :
            <List list={stories.data} />
      }
    </div>
  );
}

const SearchForm = ({onSearchSubmit, searchTerm, onSearchChange}) => {
  return (
    <>
      <form onSubmit={onSearchSubmit}>
        <label htmlFor='search'><b>Search: </b></label>
        <input id='search'
          type='rext'
          value={searchTerm}
          onChange={onSearchChange}
          placeholder='Enter Search term'
        />

        <button disabled={!searchTerm} type='submit'>Submit</button>
      </form>
    </>
  )
}

const LastSearches = ({searchTerms, terms}) => {
  // console.log('terms', Array.isArray(terms), terms.length)
  return (
    <>
      {
        terms.map((term, i) => (
          <button key={i}>{term}</button>
        ))
      }
    </>
  )
}

const List = ({list}) => {
  // console.log(list.length)
  return (
    <>
      {
        list.map( (el, i) => (
          <li key={i}>{el.title?.substr(0,30)}</li>
        )) 
      }
    </>
  )
}
