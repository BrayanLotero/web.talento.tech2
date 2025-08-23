import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
import seaborn as sns

# Título
st.title("☀️ Dashboard Energía Solar")

# Cargar el CSV local
df = pd.read_csv("energiasolar.csv")

# Mostrar tabla completa
st.subheader("📋 Tabla de datos")
st.dataframe(df)

# Gráfico sencillo: número de proyectos por Tipo
st.subheader("📊 Número de proyectos por Tipo")
conteo = df["Tipo"].value_counts()

fig1, ax1 = plt.subplots()
conteo.plot(kind="bar", ax=ax1)
ax1.set_ylabel("Cantidad de proyectos")
ax1.set_xlabel("Tipo")
ax1.set_title("Proyectos por Tipo")
st.pyplot(fig1)  # Mostrar primer gráfico

# --- SEGUNDA GRÁFICA ---

# Filtrar los proyectos de tipo 'Solar'
df_solar = df[df['Tipo'] == 'Solar'].copy()

# Seleccionar las columnas relevantes y renombrarlas para facilitar su manejo
df_solar = df_solar[['Proyecto', 'Departamento', 'Energía [kWh/día]', 'Usuarios', 'Inversión estimada [COP]']].copy()
df_solar.rename(columns={
    'Energía [kWh/día]': 'Energia_kWh_dia',
    'Usuarios': 'Usuarios_beneficiados',
    'Inversión estimada [COP]': 'Inversion_estimada_COP'
}, inplace=True)

# Convertir las columnas numéricas a tipos de datos apropiados
df_solar['Energia_kWh_dia'] = df_solar['Energia_kWh_dia'].str.replace(',', '', regex=False).astype(float)
df_solar['Usuarios_beneficiados'] = df_solar['Usuarios_beneficiados'].str.replace(',', '', regex=False).astype(int)
df_solar['Inversion_estimada_COP'] = df_solar['Inversion_estimada_COP'].str.replace(',', '', regex=False).astype(float)

# Acortar el nombre del departamento largo
df_solar['Departamento'] = df_solar['Departamento'].replace(
    'ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA', 
    'San Andrés y Providencia'
)

# Calcular la suma de energía [kWh/día] por departamento
df_energia_por_departamento = df_solar.groupby('Departamento')['Energia_kWh_dia'].sum().reset_index()

# Crear un gráfico de barras de la energía total [kWh/día] por departamento
st.subheader("🔋 Energía total generada por departamento (proyectos solares)")
fig2, ax2 = plt.subplots(figsize=(10, 5))
sns.barplot(data=df_energia_por_departamento, x='Departamento', y='Energia_kWh_dia', ax=ax2)
ax2.set_title('Energía Total kWh/día por departamento generada en proyectos solares en Colombia')
ax2.set_ylabel('kWh/día')
ax2.set_xlabel('')
plt.xticks(rotation=90)
plt.tight_layout()
st.pyplot(fig2)  # Mostrar segunda gráfica