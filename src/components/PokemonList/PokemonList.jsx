import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css"
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';

    async function downloadPokemon() {
        const response = await axios.get(POKEDEX_URL); // we get the response from the API, which contains the list of pokemon and their urls

        const pokemonResults = response.data.results;//we get the array of pokemon from result
        console.log(response.data);
        
        //we create an array of promises, where each promise is a request to get the details of a pokemon using its url
        const pokemonResultPromises = pokemonResults.map((pokemon) => axios.get(pokemon.url));

        //we wait for all the promises to resolve and get the data of all the pokemon
        const pokemonData = await axios.all(pokemonResultPromises);
        console.log(pokemonData);

        //we create a new array of pokemon objects, where each object contains the id, name, image and types of a pokemon
       const res = (pokemonData.map((pokeData) => {
            const pokemon = pokeData.data
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.front_default,
                types: pokemon.types
            };
        }));
        console.log(res);
        setPokemonList(res);
        setIsLoading(false);
    }

    useEffect(() => {
        async function fetchData() {
            await downloadPokemon();
        }
        fetchData();
    }, []);
    return (
        <div className="pokemon-list-wrapper">
            <h1>Pokemon List</h1>
            {isLoading ? <p>Loading...</p> : 
            pokemonList.map((p) => <Pokemon
            okemon name={p.name} image={p.image} key={p.id}/>)
            }
        </div>
    )
}
export default PokemonList;