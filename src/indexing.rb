require 'set'
require 'json'
require 'rmmseg'

RMMSeg::Dictionary.load_dictionaries

def segment(algo)
  words = Array.new

  token = algo.next_token
  until token.nil?
    words << token.text
    token = algo.next_token
  end

  words
end

class Entry
  
  attr_reader :token
  
  def initialize(token_name)
    @token = token_name;
    @docs = Set.new
  end
  
  def <<(doc)
    @docs << doc
  end
  
  def to_entry
    return [@token.to_s, @docs.to_a]
  end
end

class Index
  attr_reader :tokens
  
  def initialize
    @tokens = Set.new
    @tokendata = Hash.new
  end
  
  def include?(token)
    return tokens.include? token
  end
  
  def to_json
    return @tokendata.values.map {|it| it.to_entry }.to_h.to_json
  end
  
  def append(token, doc)
    unless @tokens.include? token.to_sym
      @tokens << token.to_sym
      @tokendata[token] = Entry.new(token.to_sym)
    end
    
    @tokendata[token] << doc
  end
end

def indexing(documents)
  index = Index.new
  
  documents.each do |doc|
    
    wikiItem = doc.gsub(/^cnmd\//, "").gsub(/\.cn\.md$/, "")
    
    File.open(doc) do |f|
      f.each_line do |line|
        words = segment(RMMSeg::Algorithm.new(line)); 
        p words
        words
          .select { |w| w.length >= 3 }
          .each {|w| index.append(w.force_encoding('UTF-8').downcase, wikiItem) }
      end
    end
  end
  
  return index.to_json
end
