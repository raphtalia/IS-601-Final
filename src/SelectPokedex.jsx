import { useEffect, useState } from "react";
import { Button, Card, Tile } from "react-bulma-components";

export default function SelectPokedex({ P, setError, onViewCb }) {
  const [pokedexs, setPokedexs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setPokedexs((await P.getPokedexsList()).results);
      } catch (e) {
        setError("Error getting pokedexs: " + e.message);
      }
    })();
  }, [P, setError]);

  return (
    <Tile vertical kind="ancestor">
      {pokedexs.map((pokedex, i) => {
        return (
          <Tile kind="parent" key={i}>
            <Tile kind="child" renderAs={Card}>
              <Card.Header.Title>{pokedex.name}</Card.Header.Title>
              <Card.Content>
                <Button onClick={() => onViewCb(pokedex.name)}>View</Button>
              </Card.Content>
            </Tile>
          </Tile>
        );
      })}
    </Tile>
  );
}
