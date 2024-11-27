'use client'
import { Dispatch, SetStateAction } from "react"
import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar } from "react-icons/fa"
import Cookies from "js-cookie"
import { ProdutoI } from "@/utils/types/produtos"

interface listaProdutoProps {
  produto: ProdutoI,
  produtos: ProdutoI[],
  setProdutos: Dispatch<SetStateAction<ProdutoI[]>>
}

function ItemProduto({ produto, produtos, setProdutos }: listaProdutoProps) {

  async function excluirProduto() {
    if (confirm(`Confirma a exclusão`)) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos/${produto.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
          },
        },
      )

      if (response.status == 200) {
        const produtos2 = produtos.filter(x => x.id != produto.id)
        setProdutos(produtos2)
        alert("Produto excluído com sucesso")
      } else {
        alert("Erro... Produto não foi excluído")
      }
    }
  }

  async function alterarDestaque() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos/destacar/${produto.id}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
      },
    )

    if (response.status == 200) {
      const produtos2 = produtos.map(x => {
        if (x.id == produto.id) {
          return { ...x, destaque: !x.destaque }
        }
        return x
      })
      setProdutos(produtos2)
    }
  }

  return (
    <tr key={produto.id} className="odd:bg-white odd:dark:bg-transparent even:bg-gray-50 even:dark:bg-transparent border-b dark:border-gray-500">
      <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={produto.foto} alt="Produto"
          style={{ width: 200 }} />
      </th>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.modelo}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.marca.nome}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.ano}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {Number(produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-500 inline-block cursor-pointer" title="Excluir"
          onClick={excluirProduto} />&nbsp;
        <FaRegStar className="text-3xl text-yellow-400 inline-block cursor-pointer" title="Destacar"
          onClick={alterarDestaque} />
      </td>
    </tr>
  )
}

export default ItemProduto
