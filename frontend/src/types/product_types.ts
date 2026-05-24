export type categoryType ={
    id:string,
    name:string,
    slug:string
}

export type ProductListType ={
    id: string,
    category: categoryType,
    name:string,
    slug:string,
    description:string,
    price: string,
    stock: number,
    available: boolean,
    created: string,
    updated: string,
    image?: string
}
