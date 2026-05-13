#!/bin/bash
set -e
echo ""
echo "🎭 PALCO CAPITAL — Deploy Vercel"
echo "================================"
echo ""

# Verificar se tem as chaves
if [ -z "$SUPABASE_SERVICE_KEY" ] || [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "⚠️  Informe as chaves de API:"
  echo ""
  read -p "SUPABASE_SERVICE_KEY (service_role): " SUPABASE_SERVICE_KEY
  read -p "ANTHROPIC_API_KEY: " ANTHROPIC_API_KEY
fi

echo ""
echo "▲ Fazendo deploy no Vercel..."
npx vercel --prod --yes \
  --env NEXT_PUBLIC_SUPABASE_URL=https://apsiwkvpcmhpjxzhqsya.supabase.co \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwc2l3a3ZwY21ocGp4emhxc3lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTc5MTgsImV4cCI6MjA2MjM5MzkxOH0.WoH0QN8OC8kB7nqTH5PiRgxs3wBKmUveMz9K0x6q7lE \
  --env SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY \
  --env ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY

echo ""
echo "✅ Deploy concluído! Palco Capital no ar."
