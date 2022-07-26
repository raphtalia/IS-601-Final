import { Fragment, useEffect, useState } from "react";
import { Button, Card, Tile } from "react-bulma-components";

export default function SelectPokemon({ P, setError, pokedexName, onViewDetailsCb, onBackCb }) {
  const [pokedex, setPokedex] = useState(null);

  useEffect(() => {
    if (pokedexName) {
      (async () => {
        try {
          setPokedex((await P.getPokedexByName(pokedexName)).pokemon_entries);
        } catch (e) {
          setError(`Error getting pokedex (${pokedexName}): ` + e.message);
        }
      })();
    }
  }, [P, setError, pokedexName, setPokedex]);

  return (
    <Fragment>
      <Button onClick={() => onBackCb()}>Back</Button>
      <Tile vertical kind="ancestor">
        {pokedex
          ? pokedex.map((pokemon, i) => {
              return (
                <Tile kind="parent" key={i}>
                  <Tile kind="child" renderAs={Card}>
                    <Card.Header.Title>{pokemon.pokemon_species.name}</Card.Header.Title>
                    <Card.Content>
                      <Button onClick={() => onViewDetailsCb(pokemon.pokemon_species.name)}>
                        View Details
                      </Button>
                    </Card.Content>
                  </Tile>
                </Tile>
              );
            })
          : null}
      </Tile>
    </Fragment>
  );
}
