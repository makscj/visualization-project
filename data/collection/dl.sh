while IFS="," read -ra line; do
  curl -o ${line[1]}.jpg ${line[0]}
done <temp.txt