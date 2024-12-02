'use client'

import { useState, useEffect } from 'react';
import { PropostaI } from '@/utils/types/propostas';
import Image from 'next/image';

const Propostas = () => {
  const [propostas, setPropostas] = useState<PropostaI[]>([]);
  const [preco, setPreco] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>('');
  const [produtoId, setProdutoId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPropostas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/1`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao buscar propostas');
      setPropostas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitProposta = async () => {
    if (!produtoId || !preco || !descricao) {
      alert('Por favor, preencha todos os campos corretamente!');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoId, preco, descricao }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Falha ao enviar proposta');
      alert('Proposta enviada com sucesso!');
      setPropostas((prev) => [data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropostas();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-6">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-100">Controle de Propostas</h1>
      <div className="bg-gray-500/20 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Submeter Nova Proposta</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitProposta();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="produtoId" className="block text-lg font-medium text-white">ID do Produto</label>
            <input
              type="text"
              id="produtoId"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="preco" className="block text-lg font-medium text-white">Preço</label>
            <input
              type="number"
              id="preco"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="descricao" className="block text-lg font-medium text-white">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Proposta'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <h3 className="text-2xl font-semibold text-white mb-4">Propostas Enviadas</h3>
      <div>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">Produto</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">Foto</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">Descrição</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">Carregando....</td>
              </tr>
            ) : (
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
                      onClick={() => alert('Excluindo proposta')} // Implementar a exclusão de propostas
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Propostas;
