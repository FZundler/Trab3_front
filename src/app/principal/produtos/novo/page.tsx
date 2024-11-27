'use client'

import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { MarcaI } from "@/utils/types/marcas"

type Inputs = {
  modelo: string
  marcaId: number
  ano: number
  preco: number
  foto: string
  acessorios: string
}

function NovoProduto() {
  const [marcas, setMarcas] = useState<MarcaI[]>([])
  const {
    register,
    handleSubmit,
    reset,
    setFocus
  } = useForm<Inputs>()

  useEffect(() => {
    async function getMarcas() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/marcas`)
      const dados = await response.json()
      setMarcas(dados)
    }
    getMarcas()

    setTimeout(() => {
      setFocus("modelo") // Manter o foco no campo 'modelo'
    }, 0)
  }, []) // Dependências vazias garantem que o efeito só seja executado uma vez

  const optionsMarca = marcas.map(marca => (
    <option key={marca.id} value={marca.id}>{marca.nome}</option>
  ))

  // Função para validar se a URL é válida
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  async function incluirProduto(data: Inputs) {
    // Validação da URL da foto
    if (!data.foto || !isValidUrl(data.foto)) {
      toast.error("A URL da foto não é válida.")
      return
    }

    const novoProduto: Inputs = {
      modelo: data.modelo,
      marcaId: Number(data.marcaId),
      ano: Number(data.ano),
      acessorios: data.acessorios,
      foto: data.foto,
      preco: Number(data.preco),
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
        body: JSON.stringify(novoProduto)
      })

      if (response.ok) {
        toast.success("Produto cadastrado com sucesso")
        reset()
      } else {
        console.error("Erro ao cadastrar o produto. Status:", response.status)

        let errorData = {}
        try {
          errorData = await response.json()
        } catch (err) {
          console.error("Erro ao tentar ler o corpo da resposta:", err)
        }

        console.error("Erro detalhado:", errorData)
        toast.error(errorData.message || `Erro ao cadastrar o produto. Status: ${response.status}`)
      }
    } catch (error) {
      console.error("Erro de rede ou de requisição:", error)
      toast.error("Erro de rede ou de requisição. Tente novamente.")
    }
  }

  return (
    <>
      <h1 className="mb-10 ml-96 mt-36 font-bold tracking-tight text-gray-900 lg:text-3xl dark:text-white">
        Inclusão de Produtos
      </h1>

      <form className="max-w-xl mx-96" onSubmit={handleSubmit(incluirProduto)}>
        <div className="mb-4">
          <label htmlFor="modelo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Modelo do Produto
          </label>
          <input
            type="text" id="modelo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600
             dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
            {...register("modelo")}
          />
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="marcaId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Marca
            </label>
            <select
              id="marcaId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500
               dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
               dark:focus:border-blue-500" required
              {...register("marcaId", { valueAsNumber: true })} // Garantir que o valor seja numérico
            >
              {optionsMarca}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="ano" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Ano
            </label>
            <input
              type="number" id="ano"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
             focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("ano")}
            />
          </div>
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Preço R$
            </label>
            <input
              type="number" id="preco"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("preco")}
            />
          </div>
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              URL da Foto
            </label>
            <input
              type="text" id="foto"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
               dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
               dark:focus:ring-blue-500 dark:focus:border-blue-500" required
              {...register("foto")}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="acessorios" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Acessórios
          </label>
          <textarea
            id="acessorios" rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border
             border-gray-300 focus:ring-blue-500 focus:border-blue-500
             dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
             dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("acessorios")}
          ></textarea>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
        focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5
         py-2.5 text-center dark:bg-blue-900 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Incluir
        </button>
      </form>
    </>
  )
}

export default NovoProduto
