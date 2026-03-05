export interface Pet {
    name: string; 
    type: string;
    favorite: boolean; 
    breed?: string; 
    age?: number ; 
    gender?: string; 
    location? : {
    lat: number,
    lng: number
    }; 
    city?: string; 
    description?: string, 
    image?: string, 
    available?: boolean, 
    shelterName?: string, 
    email?: string, 
}

