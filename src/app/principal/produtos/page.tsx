'use client'
import { useEffect, useState } from "react"
import Link from 'next/link'
import ItemProduto from '@/components/ItemProduto'
import { ProdutoI } from "@/utils/types/produtos"

function CadProdutos() {
  const [produtos, setProdutos] = useState<ProdutoI[]>([])

  useEffect(() => {
    async function getProdutos() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos`)
      const dados = await response.json()
      setProdutos(dados)
    }
    getProdutos()
  }, [])

  const listaProdutos = produtos.map(produto => (
    <ItemProduto key={produto.id} produto={produto} produtos={produtos} setProdutos={setProdutos} />
  ))

  return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Cadastro de Produto
        </h1>
        <Link href="produtos/novo" 
          className="text-white bg-yellow-700 hover:bg-yellow-500 focus:ring-4 focus:ring-blue-300 
          font-bold rounded-lg text-md px-6 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 
          focus:outline-none dark:focus:ring-blue-800">
          Novo Produto
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-100 dark:text-gray-100">
          <thead className="text-xs text-gray-100 uppercase bg-gray-50 dark:bg-gray-500 dark:text-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Foto
              </th>
              <th scope="col" className="px-6 py-3">
                Modelo do Produto
              </th>
              <th scope="col" className="px-6 py-3">
                Marca
              </th>
              <th scope="col" className="px-6 py-3">
                Ano
              </th>
              <th scope="col" className="px-6 py-3">
                Preço R$
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {listaProdutos}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CadProdutos