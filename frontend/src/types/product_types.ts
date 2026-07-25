export type  ProductQueryParamsType = {
    search?: string;
    limit?: number;
    offset?: number;
    category?: string;
}

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

export type CatalogType ={
    count:number,
    next:string,
    previous:string,
    results: ProductListType[]
}
