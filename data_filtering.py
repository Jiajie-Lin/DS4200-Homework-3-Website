#data Filtering

import pandas as pd 

df = pd.read_csv('socialMedia.csv')


print(df.Likes)

sbs_bar = df[['Platform', 'PostType']]

unique_platform = sbs_bar.Platform.unique()
unique_posttype = sbs_bar.PostType.unique()
print(unique_platform)
print(unique_posttype)

df2 = df.groupby(['Platform','PostType'])['Likes'].mean()
print(df2)

df2.to_csv('socialMediaAvg.csv')