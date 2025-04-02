
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const API_KEY_STORAGE_KEY = 'nba_api_key';

const ApiKeySettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Verificar se a API key já está definida
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsKeySet(true);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira uma API Key válida."
      });
      return;
    }
    
    // Salvar API key no armazenamento local
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    setIsKeySet(true);
    
    // Atualizar o valor da API key no serviço
    // Isso assumirá que o arquivo nbaService.ts será atualizado para ler a API key do localStorage
    
    toast({
      title: "API Key salva",
      description: "Sua API Key foi salva com sucesso."
    });
    
    // Recarregar a página para aplicar a nova API key
    window.location.reload();
  };
  
  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setIsKeySet(false);
    
    toast({
      title: "API Key removida",
      description: "Sua API Key foi removida com sucesso."
    });
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          {isKeySet ? "API Key Configurada" : "Configurar API Key"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Configuração da API Key</AlertDialogTitle>
          <AlertDialogDescription>
            Para acessar dados reais da NBA, você precisa de uma API Key da RapidAPI.
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Visite <a href="https://rapidapi.com/api-sports/api/api-nba" target="_blank" rel="noopener noreferrer" className="text-primary underline">RapidAPI NBA</a></li>
              <li>Cadastre-se e assine o plano (há opções gratuitas)</li>
              <li>Copie sua API Key e cole abaixo</li>
            </ol>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Input
            type="password"
            placeholder="ac407d0d28msh835a3b13e4f2039p1b948ajsn70b9c17da945"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          {isKeySet && (
            <p className="mt-2 text-sm text-green-600">
              API Key já configurada. Você pode alterá-la ou removê-la.
            </p>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveApiKey}>Salvar</AlertDialogAction>
          {isKeySet && (
            <Button variant="destructive" onClick={handleClearApiKey}>
              Remover
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApiKeySettings;
