import { Fragment, useEffect, useState } from "react";
import { Button, Card, Table } from "react-bulma-components";

export default function PokemonDetails({ P, setError, pokemonName, onBackCb }) {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setPokemon(await P.getPokemonByName(pokemonName));
      } catch (e) {
        setError(`Error getting pokemon details (${pokemonName}): ` + e.message);
      }
    })();
  }, [P, setError, pokemonName, setPokemon]);

  return pokemon ? (
    <Fragment>
      <Button onClick={() => onBackCb()}>Back</Button>
      <Card>
        <Card.Header.Title>{pokemon.name}</Card.Header.Title>
        <Card.Image size={128} src={pokemon.sprites.front_default} />
        <Card.Content>
          <Table>
            <thead>
              <tr>
                <th>Ability Name</th>
                <th>Hidden</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.abilities.map((ability, i) => (
                <tr key={i}>
                  <td>{ability.ability.name}</td>
                  <td>{ability.is_hidden ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Stats</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pokemon.stats.map((stat, i) => (
                <tr key={i}>
                  <td>{stat.stat.name}</td>
                  <td>{stat.base_stat}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <th>Types</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.types.map((type, i) => (
                <tr key={i}>
                  <td>{type.type.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Content>
      </Card>
    </Fragment>
  ) : null;
}
