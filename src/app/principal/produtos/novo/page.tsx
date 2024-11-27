"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Inputs {
  modelo: string;
  marcaId: string; // Mantemos como string porque é o tipo original esperado no formulário
  ano: string;
  acessorios: string;
  foto: string;
  preco: string;
}

export default function NovoProdutoPage() {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [marcas, setMarcas] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    // Buscar as marcas da API
    async function fetchMarcas() {
      try {
        const response = await fetch("/api/marcas");
        if (!response.ok) throw new Error("Erro ao buscar marcas");

        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error("Erro ao buscar marcas:", error);
        toast.error("Erro ao buscar marcas. Tente novamente mais tarde.");
      }
    }

    fetchMarcas();
  }, []);

  const onSubmit = async (data: Inputs) => {
    const novoProduto = {
      modelo: data.modelo,
      marcaId: Number(data.marcaId), // Convertendo para número ao enviar
      ano: Number(data.ano), // Convertendo para número ao enviar
      acessorios: data.acessorios,
      foto: data.foto,
      preco: Number(data.preco), // Convertendo para número ao enviar
    };

    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoProduto),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string }; // Tipo opcional para evitar erros
        console.error("Erro detalhado:", errorData);

        toast.error(
          errorData.message ||
            `Erro ao cadastrar o produto. Status: ${response.status}`
        );
        return;
      }

      toast.success("Produto cadastrado com sucesso!");
      reset(); // Resetar o formulário após sucesso
    } catch (error) {
      console.error("Erro de rede ou de requisição:", error);
      toast.error("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Produto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Modelo</label>
          <input
            type="text"
            {...register("modelo", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Marca</label>
          <select
            {...register("marcaId", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecione uma marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Ano</label>
          <input
            type="number"
            {...register("ano", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Acessórios</label>
          <input
            type="text"
            {...register("acessorios", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Foto (URL)</label>
          <input
            type="text"
            {...register("foto", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Preço</label>
          <input
            type="number"
            step="0.01"
            {...register("preco", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
