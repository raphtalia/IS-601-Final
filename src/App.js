import { Fragment, useState } from "react";
import { Container, Message, Navbar } from "react-bulma-components";
import { Pokedex } from "pokeapi-js-wrapper";
import SelectPokedex from "./SelectPokedex";
import SelectPokemon from "./SelectPokemon";
import PokemonDetails from "./PokemonDetails";
const P = new Pokedex();

export default function App() {
  const [selectedPokedexName, setSelectedPokedexName] = useState(null);
  const [selectedPokemonName, setSelectedPokemonName] = useState(null);
  const [error, setError] = useState(null);

  return (
    <Fragment>
      <Navbar>
        <Navbar.Menu>
          <Navbar.Container>
            <Navbar.Item href="/">Home</Navbar.Item>
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
      <Container>
        {error ? (
          // if error occurs
          <Message color="danger">
            <Message.Header>Error</Message.Header>
            <Message.Body>{error}</Message.Body>
          </Message>
        ) : selectedPokemonName ? (
          // if pokemon is selected
          <PokemonDetails
            P={P}
            setError={setError}
            pokemonName={selectedPokemonName}
            onBackCb={() => setSelectedPokemonName(null)}
          />
        ) : selectedPokedexName ? (
          // if there is a selected pokedex
          <SelectPokemon
            P={P}
            setError={setError}
            pokedexName={selectedPokedexName}
            onViewDetailsCb={setSelectedPokemonName}
            onBackCb={() => setSelectedPokedexName(null)}
          />
        ) : (
          // if there is no selected pokedex
          <SelectPokedex P={P} setError={setError} onViewCb={setSelectedPokedexName} />
        )}
      </Container>
    </Fragment>
  );
}
