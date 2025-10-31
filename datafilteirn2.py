import pandas as pd

df = pd.read_csv('SocialMedia.csv')


df2 = df.groupby(['Date'])['Likes'].mean()

print(df2)

df2.to_csv('SocialMediaTime.csv')
