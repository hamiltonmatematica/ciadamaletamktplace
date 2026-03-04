-- Adicionar coluna click_count à tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- Criar função RPC para incrementar cliques
CREATE OR REPLACE FUNCTION increment_click_count(product_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE products SET click_count = click_count + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
