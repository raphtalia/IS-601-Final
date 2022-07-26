import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pokedex } from "pokeapi-js-wrapper";
import App, { selectedPokedexNameFOR_TESTING, selectedPokemonNameFOR_TESTING } from "./App";

jest.mock("pokeapi-js-wrapper");

function setupPassingAPIMocks() {
  // Cannot directly mock these methods on Pokedex due to the methods being
  // generatoed in the constructor when the Pokedex class is instantiated.
  Pokedex.prototype.getPokedexsList = jest.fn(() =>
    Promise.resolve({ results: [{ name: "national" }] })
  );
  Pokedex.prototype.getPokedexByName = jest.fn(() =>
    Promise.resolve({
      pokemon_entries: [{ entry_number: 1, pokemon_species: { name: "bulbasaur" } }],
    })
  );
  Pokedex.prototype.getPokemonByName = jest.fn(() =>
    Promise.resolve({
      abilities: [{ ability: { name: "overgrow" } }],
      name: "bulbasaur",
      types: [{ type: { name: "grass" } }],
      sprites: {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      },
      stats: [{ base_stat: 49, stat: { name: "attack" } }],
    })
  );
}

function setupFailingAPIMocks() {
  // Cannot directly mock these methods on Pokedex due to the methods being
  // generatoed in the constructor when the Pokedex class is instantiated.
  Pokedex.prototype.getPokedexsList = jest.fn(() => Promise.reject(new Error("Simulated Error")));
  Pokedex.prototype.getPokedexByName = jest.fn(() => Promise.reject(new Error("Simulated Error")));
  Pokedex.prototype.getPokemonByName = jest.fn(() => Promise.reject(new Error("Simulated Error")));
}

function setup(jsx, simulateFail) {
  if (simulateFail) {
    setupFailingAPIMocks();
  } else {
    setupPassingAPIMocks();
  }

  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

afterEach(() => {
  jest.clearAllMocks();
});

// Requirement 1
test("GIVEN a new user WHEN they load the application for the first time THEN they are presented with a list of Pokédexes returned from the PokeAPI", async () => {
  setup(<App />);
  await screen.findByText("national");
});

// Requirement 2
test("GIVEN the user is attempting to select a Pokédex WHEN an error occurs from the API THEN they are presented with an error message AND the list of Pokédexes does not render", async () => {
  setup(<App />, true);
  await screen.findByText("Simulated Error", { exact: false });
  expect(screen.queryByText("national")).toBeNull();
});

// Requirement 3
test('GIVEN a user see Pokédexes to select WHEN the user clicks the "View" button for a given Pokédex THEN their selection is stored', async () => {
  // Testing state directly is not ideal
  // https://stackoverflow.com/questions/61813319/check-state-of-a-component-using-react-testing-library
  // https://testing-library.com/docs/#what-you-should-avoid-with-testing-library
  const { user } = setup(<App />);
  await user.click(await screen.findByText("View"));
  expect(selectedPokedexNameFOR_TESTING).toBe("national");
});

// Requirement 4
test('GIVEN a user sees a list of Pokédexes to select WHEN the user clicks the "View" button for a given Pokédex THEN they are presented with a list of Pokémon from the Pokédex', async () => {
  const { user } = setup(<App />);
  await user.click(await screen.findByText("View"));
  await screen.findByText("bulbasaur");
});

// Requirement 5
test("GIVEN the user is attempting to select a Pokémon WHEN an error occurs from the API THEN they are presented with an error message AND the list of Pokémon does not render", async () => {
  setup(<App />, true);
  await screen.findByText("Simulated Error", { exact: false });
  expect(screen.queryByText("bulbasaur")).toBeNull();
});

// Requirement 6
test('GIVEN a user see a list of Pokémon to select WHEN the user clicks the "View Details" button for a given Pokémon THEN their selection is stored', async () => {
  // Testing state directly is not ideal
  // https://stackoverflow.com/questions/61813319/check-state-of-a-component-using-react-testing-library
  // https://testing-library.com/docs/#what-you-should-avoid-with-testing-library
  const { user } = setup(<App />);
  await user.click(await screen.findByText("View"));
  await user.click(await screen.findByText("View Details"));
  expect(selectedPokemonNameFOR_TESTING).toBe("bulbasaur");
});

// Requirement 7
test('GIVEN a user sees a list of Pokémon to select WHEN the user clicks the "View Details" button for a given Pokémon THEN they are presented with details of their selected Pokémon', async () => {
  const { user } = setup(<App />);
  await user.click(await screen.findByText("View"));
  await user.click(await screen.findByText("View Details"));
  await screen.findByText("bulbasaur");
  expect(screen.getByText("overgrow")).toBeInTheDocument();
  expect(screen.getByText("attack")).toBeInTheDocument();
  expect(screen.getByText("grass")).toBeInTheDocument();
  expect(screen.getByText("49")).toBeInTheDocument();
});

// Requirement 8
test("GIVEN the user is attempting to view Pokémon Details WHEN an error occurs from the API THEN they are presented with an error message AND the Pokémon details do not render", async () => {
  setup(<App />, true);
  await screen.findByText("Simulated Error", { exact: false });
  expect(screen.queryByText("bulbasaur")).toBeNull();
});

// Requirement 9
test('GIVEN a user is using your application WHEN they click the "Home" button THEN they are returned to the first screen', async () => {
  const { user } = setup(<App />);
  await user.click(await screen.findByText("View"));
  await user.click(await screen.findByText("View Details"));
  await screen.findByText("Ability Name");
  await user.click(screen.getByText("Home"));
  await screen.findByText("national");
});

// Requirement 10
test('GIVEN a user has selected a Pokédex or a Pokémon WHEN they click the "Back" button THEN the user should move back one screen', async () => {
  const { user } = setup(<App />);
  await user.click(await screen.findByText("View"));
  await user.click(await screen.findByText("View Details"));
  await screen.findByText("Ability Name");
  await user.click(screen.getByText("Back"));
  await screen.findByText("View Details");
});
