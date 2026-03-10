import {render, screen} from '@testing-library/react';
import {describe,test,expect,vi} from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MapComponent from './MapComponent.js';


//Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({children}: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-test-id="tile-layer"/>,
  Marker: ({children}: any) => <div data-testid="markers">{children}</div>,
  Popup: ({children}: any) => <div data-testid="popup">{children}</div>
  
}));

const mockPets = [
  {
    _id: "1",
    name: "Buddy",
    age: "2",
    shelterName: "Happy Shelter",
    location: {lat: 51.5, lng: -0.09}
  },
  {
    _id: "2",
    name: "John",
    age: "3",
    shelterName: "Us Shelter",
    location: {lat: 51.51, lng: -0.08} 
  }
];

describe("MapComponent", () => {

  test('Renders Map', () => {
    render(
      <MemoryRouter>
        <MapComponent pets={[]} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  test('Renders pet markers', () => {
    render(
      <MemoryRouter>
        <MapComponent pets={mockPets as any} />
      </MemoryRouter>
    );

    const markers = screen.getAllByTestId('markers');

    expect(markers.length).toBe(mockPets.length);
  });

  test('Displays pet info when marker clicked', () => {
    render(
      <MemoryRouter>
        <MapComponent pets={mockPets as any} />
      </MemoryRouter>
    )

    expect(screen.getByText(mockPets[0]!.name)).toBeInTheDocument();
    expect(screen.getByText(`Age: ${mockPets[0]!.age}`)).toBeInTheDocument();
    expect(screen.getByText(`Shelter: ${mockPets[0]!.shelterName}`)).toBeInTheDocument();
  });

  test('Renders link to pet details', () => {
    render(
      <MemoryRouter>
        <MapComponent pets={mockPets as any} />
      </MemoryRouter>
    );
    const link = screen.getAllByRole("link", {name: /View Details/i});

    expect(link[0]).toHaveAttribute("href", "/pets/1");
    expect(link[1]).toHaveAttribute("href", "/pets/2");

  });
  
})