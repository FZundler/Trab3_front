"use client";

import { useState, useEffect } from "react";
import { PropostaI } from "@/utils/types/propostas";
import Image from "next/image";

const Propostas = () => {
  const [propostas, setPropostas] = useState<PropostaI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar as propostas
  const fetchPropostas = async () => {
    setIsLoading(true);
    setError(null); // Limpa o erro anterior

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/propostas/1`,
      );

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao buscar propostas");
      }

      const data = await response.json();
      setPropostas(data); // Atualiza o estado com as propostas
    } catch (err: unknown) {
      // Se ocorrer um erro, define a mensagem de erro
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  // Chama a função de busca assim que o componente for montado
  useEffect(() => {
    fetchPropostas();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-6">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-100">
        Controle de Propostas 👨🏻‍💻
      </h1>

      {/* Exibe erro, se houver */}
      {error && <p className="text-red-600">{error}</p>}

      <h3 className="text-2xl font-semibold text-white mb-4">
        Propostas Enviadas
      </h3>

      <div>
        {/* Tabela de Propostas */}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Verifica se está carregando */}
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Carregando....
                </td>
              </tr>
            ) : // Exibe as propostas retornadas da API
            propostas.length > 0 ? (
              propostas.map((proposta) => (
                <tr key={proposta.id} className="hover:bg-gray-100">
                  <td className="px-6 py-3">{proposta.produtoId}</td>
                  <td className="px-6 py-3">
                    <Image
                      src={`https://via.placeholder.com/150?text=Imagem+${proposta.produtoId}`}
                      alt={`Imagem do produto ${proposta.produtoId}`}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </td>
                  <td className="px-6 py-3">{proposta.descricao}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => alert("Excluindo proposta")}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-white">
                  Nenhuma proposta encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Propostas;
