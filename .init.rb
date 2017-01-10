
$DICT = {}

def command(*commands, &block)
    dict = commands.reduce([$DICT]) do |pair, c|
        d=pair[0]
        d[c] = {} unless d.include? c
        [d[c], c]
    end
    dict[0][:command] = block
end

def run_command()
    counter = 0
    dict = $DICT

    for arg in ARGV do
        if dict.include? arg.to_sym
            counter+=1
            next_dict = dict[arg.to_sym]
            dict = next_dict
            if dict.include? :command && dict.size == 1
                dict[:command].call(ARGV.drop(counter))
                break
            end
        elsif dict.include? :command
            dict[:command].call(ARGV.drop(counter))
            break
        end
    end
end