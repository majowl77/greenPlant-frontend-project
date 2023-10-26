export type ProductsInitialState = {
  productList: Product[]
  error: null | string
  isLoading: boolean,
}
export type ProductInitialState = {
  error: null | string
  isLoading: boolean
  product: Product | null
}
export type UsersinitialState = {
  users: Users[]
  isLogedin: boolean
  error: null
}

export type Users = {
  id: number
  firstName: string
  lastName:string
  email:string
  password: string
  role: string
}

export type Product = {
  id: number
  name: string
  image: string
  description: string
  categories: number[]
  variants: string[]
  sizes: string[]
  price: number
}

export type ProductState = {
  items: Product[]
  error: null | string
  isLoading: boolean
}